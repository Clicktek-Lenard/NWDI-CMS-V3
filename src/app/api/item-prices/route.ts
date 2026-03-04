import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/item-prices?companyId=&clinicCode=
 *
 * Mirrors QueueItemPriceController::show() + queueTempCreateAdd.blade.php column mapping.
 *
 * Response row shape matches the PHP DataTable fields exactly:
 *   IdItem, Code, Description, Price, PriceGroup, PDefault,
 *   ItemUsed, CompanyCode,
 *   Group (itemmaster.Group), IMSubGroup (itemmaster.SubGroup),
 *   IMAllowQty (itemmaster.AllowQty), SubGroup (company.SubGroup)
 *
 * Plus extras for our transaction row: readersFee, origAmount
 *
 * Discount branches (mirrors PHP if/elseif/else):
 *   Branch 1 – pct>0, hasGroups, hasCodes, !lessRF
 *   Branch 2 – pct>0, !hasGroups, hasCodes, !lessRF  (ReApply support)
 *   Branch 3 – pct>0, !hasGroups, !hasCodes, lessRF=Yes
 *   Else     – no discount
 */
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "queue");

  const companyIdStr = request.nextUrl.searchParams.get("companyId") ?? "";
  const clinicCode   = request.nextUrl.searchParams.get("clinicCode") ?? "";

  const companyId = parseInt(companyIdStr);
  if (!companyId || isNaN(companyId)) {
    return NextResponse.json({ data: [] });
  }

  try {
    // ── 1. Fetch selected company (pricing flags + ErosCode + SubGroup) ──
    const company = await prisma.company.findUnique({
      where: { Id: companyId },
      select: {
        ErosCode:             true,
        SubGroup:             true,
        UsedPriceDefault:     true,
        UsedPercentDefault:   true,
        UsedPercentItemGroup: true,
        UsedPercentItemCode:  true,
        UsedLessReadersFee:   true,
      },
    });

    if (!company) return NextResponse.json({ data: [] });

    // ── 2. Fetch default company for this clinic ──────────────────────
    const defaultCompany = await prisma.company.findFirst({
      where: {
        Status: "Active",
        Name:   { contains: "DEFAULT" },
        OR: [
          { UsedClinic: { contains: clinicCode } },
          { UsedClinic: "ALL" },
          { IdBU: clinicCode },
          { IdBU: "ALL" },
        ],
      },
      select:  { ErosCode: true, SubGroup: true },
      orderBy: { Name: "asc" },
    });

    // ── 3. Company-specific items ─────────────────────────────────────
    // WHERE Status=1 AND CompanyCode = ErosCode AND (ClinicCode = clinic OR 'ALL')
    const companyItems = await prisma.itemprice.findMany({
      where: {
        CompanyCode: company.ErosCode,
        Status:      1,
        OR: [
          { ClinicCode: clinicCode },
          { ClinicCode: "ALL" },
        ],
      },
      orderBy: { Code: "asc" },
      take:    1000,
    });

    // ── 4. Default company items ──────────────────────────────────────
    // WHERE Status=1 AND CompanyCode = defaultCompany.ErosCode
    let defaultItems: typeof companyItems = [];
    if (defaultCompany && defaultCompany.ErosCode !== company.ErosCode) {
      defaultItems = await prisma.itemprice.findMany({
        where:   { CompanyCode: defaultCompany.ErosCode, Status: 1 },
        orderBy: { Code: "asc" },
        take:    1000,
      });
    }

    // ── 5. Batch-fetch itemmaster for enrichment ──────────────────────
    const allCodes = [
      ...new Set([
        ...companyItems.map((i) => i.Code).filter((c): c is string => c !== null),
        ...defaultItems.map((i)  => i.Code).filter((c): c is string => c !== null),
      ]),
    ];

    const masterRows = allCodes.length > 0
      ? await prisma.itemmaster.findMany({
          where:  { Code: { in: allCodes } },
          select: {
            Code:        true,
            Group:       true,
            SubGroup:    true,   // IMSubGroup in PHP
            DepartmentGroup: true,
            Notes:       true,
            AllowQty:    true,   // IMAllowQty in PHP
            ReadersFee:  true,
            Rebates:     true,
            ReApply:     true,
          },
        })
      : [];

    const masterMap = new Map(masterRows.map((m) => [m.Code, m]));

    // ── 6. Parse company pricing flags ────────────────────────────────
    const pct              = Number(company.UsedPercentDefault ?? 0);
    const usedPriceDefault = company.UsedPriceDefault === "Yes";
    const usedLessRF       = company.UsedLessReadersFee === "Yes";

    const itemGroups = (company.UsedPercentItemGroup ?? "")
      .split(",")
      .map((s) => s.trim().replace(/['"]/g, ""))
      .filter(Boolean);

    const itemCodes = (company.UsedPercentItemCode ?? "")
      .split(",")
      .map((s) => s.trim().replace(/['"]/g, ""))
      .filter(Boolean);

    const hasGroups = itemGroups.length > 0;
    const hasCodes  = itemCodes.length  > 0;

    type MasterRow = typeof masterRows[0];

    /** Apply discount to a default-company item. Returns final display price. */
    function applyDiscount(
      price:  number,
      item:   typeof companyItems[0],
      im:     MasterRow | undefined
    ): number {
      if (item.PriceGroup === "Package") return price;
      if (!usedPriceDefault || pct === 0) return price;

      const rf      = im?.ReadersFee ?? 0;
      const rebates = im?.Rebates    ?? 0;
      const reApply = im?.ReApply    ?? false;

      // Branch 1 — group AND code list, no readers-fee adjustment
      if (hasGroups && hasCodes && !usedLessRF) {
        const inGroup = !!im?.Group && itemGroups.includes(im.Group);
        const inCode  = itemCodes.includes(item.Code ?? "");
        if (inGroup || inCode) return price - (pct / 100) * price;
        return price;
      }

      // Branch 2 — code list only, no readers-fee adjustment
      if (!hasGroups && hasCodes && !usedLessRF) {
        if (itemCodes.includes(item.Code ?? "")) {
          if (!reApply) {
            return price - (pct / 100) * price;
          } else {
            // Discount on (Price − RF − Rebates)
            return price - (pct / 100) * (price - rf - rebates);
          }
        }
        return price;
      }

      // Branch 3 — readers-fee-aware global discount
      if (!hasGroups && !hasCodes && usedLessRF) {
        if (rf === 0) {
          return price - (pct / 100) * price;
        }
        const discountable = price - rf;
        return discountable - (pct / 100) * discountable + rf;
      }

      // Else — simple global percentage off
      return price - (pct / 100) * price;
    }

    // ── 7. Build merged result (company items win per Code) ───────────
    type ResultRow = {
      // PHP DataTable fields (exact names)
      IdItem:      number;
      Code:        string;
      Description: string;
      Price:       number;       // discounted display price
      PriceGroup:  string;
      PDefault:    string;       // shown in red in description column
      ItemUsed:    number;
      CompanyCode: string;
      Group:       string;       // itemmaster.Group  (data-toggle-subgroup)
      IMSubGroup:  string;       // itemmaster.SubGroup
      IMAllowQty:  string;       // "0" or "1" — controls Qty input visibility
      SubGroup:    string;       // company.SubGroup  (data-toggle-group)
      // Extras for transaction row creation
      readersFee:  number;
      origAmount:  number;
    };

    const result: ResultRow[] = [];
    const companyCodes = new Set(companyItems.map((i) => i.Code));
    const companySubGroup = company.SubGroup ?? "";

    // Company-specific rows (no discount)
    for (const item of companyItems) {
      const im = masterMap.get(item.Code ?? "");
      result.push({
        IdItem:      Number(item.Id),
        Code:        item.Code ?? "",
        Description: item.Description ?? item.Code ?? "",
        Price:       item.Price,
        PriceGroup:  item.PriceGroup ?? "Item",
        PDefault:    "",
        ItemUsed:    item.ItemUsed,
        CompanyCode: item.CompanyCode ?? "",
        Group:       im?.Group    ?? "",
        IMSubGroup:  im?.SubGroup ?? "",
        IMAllowQty:  String(im?.AllowQty ?? 0),
        SubGroup:    companySubGroup,
        readersFee:  im?.ReadersFee ?? 0,
        origAmount:  item.Price,
      });
    }

    // Default rows — only for codes not covered by company items
    const defaultSubGroup = defaultCompany?.SubGroup ?? "";
    for (const item of defaultItems) {
      if (companyCodes.has(item.Code)) continue;
      const im            = masterMap.get(item.Code ?? "");
      const discountedAmt = applyDiscount(item.Price, item, im);
      const pDefault      = usedPriceDefault && pct > 0
        ? `${clinicCode} default less ${pct}%`
        : `${clinicCode} default`;

      result.push({
        IdItem:      Number(item.Id),
        Code:        item.Code ?? "",
        Description: item.Description ?? item.Code ?? "",
        Price:       discountedAmt,
        PriceGroup:  item.PriceGroup ?? "Item",
        PDefault:    pDefault,
        ItemUsed:    item.ItemUsed,
        CompanyCode: item.CompanyCode ?? "",
        Group:       im?.Group    ?? "",
        IMSubGroup:  im?.SubGroup ?? "",
        IMAllowQty:  String(im?.AllowQty ?? 0),
        SubGroup:    defaultSubGroup,
        readersFee:  im?.ReadersFee ?? 0,
        origAmount:  item.Price,
      });
    }

    result.sort((a, b) => a.Code.localeCompare(b.Code));

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Item prices query error:", error);
    return NextResponse.json({ data: [], warning: "Item price data unavailable" });
  }
}
