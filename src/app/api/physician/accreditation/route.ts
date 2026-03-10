import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "erosui", "physician");
  void session;

  const { searchParams } = new URL(request.url);
  const status    = searchParams.get("status") ?? "pending";
  const search    = searchParams.get("search") ?? "";
  const page      = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize  = Math.min(100, parseInt(searchParams.get("pageSize") ?? String(PAGE_SIZE), 10));

  const statusMap: Record<string, string> = {
    pending:  "Pending",
    active:   "Active",
    declined: "Declined",
    inactive: "Inactive",
  };
  const dbStatus = statusMap[status] ?? "Pending";

  const offset = (page - 1) * pageSize;
  const searchLike = `%${search}%`;

  const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    `SELECT
       p.id, p.fullname, p.lastname, p.firstname, p.middlename, p.suffix,
       p.prcno, p.prcvalidity, p."Degree", p."Group", p.subgroup,
       p.branchcode, p.email, p.mobile, p.status, p.declinereason,
       p.requestorby, p.approveby, p.inputdate, p.inputby,
       p.updateby, p.updatedate,
       p.pcp, p.specialist, p.regular, p.reliever, p.visiting, p.referring, p.resigndoctor,
       p.schedule, p.timestart, p.timeend, p.nwdbranch, p.byappointment,
       p.applicationletter, p.curriculumvitae, p.diploma, p.prcid,
       p.residencycertificate, p.diplomatecertificate, p.philhealth,
       p.ptr, p.bir, p.moa
     FROM physician p
     WHERE p.status = $1
       AND ($2 = '' OR p.fullname ILIKE $3 OR p.prcno ILIKE $3)
     ORDER BY p.inputdate DESC, p.id DESC
     LIMIT $4 OFFSET $5`,
    dbStatus, search, searchLike, pageSize, offset
  );

  const totalRows = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
    `SELECT COUNT(*) AS count FROM physician p
     WHERE p.status = $1
       AND ($2 = '' OR p.fullname ILIKE $3 OR p.prcno ILIKE $3)`,
    dbStatus, search, searchLike
  );

  const total = Number(totalRows[0]?.count ?? 0);

  const physicians = rows.map((r) => ({
    id:                  Number(r.id),
    fullname:            r.fullname,
    lastname:            r.lastname,
    firstname:           r.firstname,
    middlename:          r.middlename,
    suffix:              r.suffix,
    prcno:               r.prcno,
    prcvalidity:         r.prcvalidity,
    degree:              r.Degree,
    group:               r.Group,
    subgroup:            r.subgroup,
    branchcode:          r.branchcode,
    email:               r.email,
    mobile:              r.mobile,
    status:              r.status,
    declinereason:       r.declinereason,
    requestorby:         r.requestorby,
    approveby:           r.approveby,
    inputdate:           r.inputdate,
    inputby:             r.inputby,
    updateby:            r.updateby,
    updatedate:          r.updatedate,
    pcp:                 r.pcp,
    specialist:          r.specialist,
    regular:             r.regular,
    reliever:            r.reliever,
    visiting:            r.visiting,
    referring:           r.referring,
    resigndoctor:        r.resigndoctor,
    schedule:            r.schedule,
    timestart:           r.timestart,
    timeend:             r.timeend,
    nwdbranch:           r.nwdbranch,
    byappointment:       r.byappointment,
    applicationletter:   r.applicationletter,
    curriculumvitae:     r.curriculumvitae,
    diploma:             r.diploma,
    prcid:               r.prcid,
    residencycertificate: r.residencycertificate,
    diplomatecertificate: r.diplomatecertificate,
    philhealth:          r.philhealth,
    ptr:                 r.ptr,
    bir:                 r.bir,
    moa:                 r.moa,
  }));

  return NextResponse.json({
    physicians,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "erosui", "physician");
  const body = await request.json();

  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const by    = session.user.name ?? session.user.username ?? "unknown";

  const fullname = [body.firstname, body.middlename, body.lastname, body.suffix]
    .filter(Boolean).join(" ");

  // Guard: PRC No must be unique (skip if empty)
  if (body.prcno) {
    const dup = await prisma.$queryRawUnsafe<Array<{ id: bigint }>>(
      `SELECT id FROM physician WHERE prcno = $1 LIMIT 1`,
      body.prcno
    );
    if (dup.length > 0) {
      return NextResponse.json(
        { error: `PRC No. "${body.prcno}" is already registered to another physician.` },
        { status: 409 }
      );
    }
  }

  await prisma.$executeRawUnsafe(
    `INSERT INTO physician (
       id,
       fullname, lastname, firstname, middlename, suffix, dob,
       prcno, prcvalidity, "Degree", "Group", subgroup,
       branchcode, email, mobile,
       pcp, specialist, regular, reliever, visiting, referring, resigndoctor,
       schedule, timestart, timeend, nwdbranch, byappointment,
       applicationletter, curriculumvitae, diploma, prcid,
       residencycertificate, diplomatecertificate, philhealth, ptr, bir, moa,
       status, requestorby, inputdate, inputby, systemupdatetime
     ) VALUES (
       (SELECT COALESCE(MAX(id), 0) + 1 FROM physician),
       $1,$2,$3,$4,$5,$6,
       $7,$8,$9,$10,$11,
       $12,$13,$14,
       $15,$16,$17,$18,$19,$20,$21,
       $22,$23,$24,$25,$26,
       $27,$28,$29,$30,
       $31,$32,$33,$34,$35,$36,
       'Pending',$37,$38,$39,$40
     )`,
    fullname,
    body.lastname   ?? null,
    body.firstname  ?? null,
    body.middlename ?? null,
    body.suffix     ?? null,
    body.dob        ? new Date(body.dob) : null,
    body.prcno      ?? null,
    body.prcvalidity ? new Date(body.prcvalidity) : null,
    body.degree     ?? null,
    body.group      ?? null,
    body.subgroup   ?? null,
    body.branchcode ?? null,
    body.email      ?? null,
    body.mobile     ?? null,
    body.pcp            ? "Y" : "N",
    body.specialist     ? "Y" : "N",
    body.regular        ? "Y" : "N",
    body.reliever       ? "Y" : "N",
    body.visiting       ? "Y" : "N",
    body.referring      ? "Y" : "N",
    body.resigndoctor   ? "Y" : "N",
    body.schedule       ?? null,
    body.timestart      ?? null,
    body.timeend        ?? null,
    body.nwdbranch      ?? null,
    body.byappointment  ?? "N",
    body.applicationletter   ? "Y" : "N",
    body.curriculumvitae     ? "Y" : "N",
    body.diploma             ? "Y" : "N",
    body.prcid               ? "Y" : "N",
    body.residencycertificate ? "Y" : "N",
    body.diplomatecertificate ? "Y" : "N",
    body.philhealth          ? "Y" : "N",
    body.ptr                 ? "Y" : "N",
    body.bir                 ? "Y" : "N",
    body.moa                 ? "Y" : "N",
    by,
    today,
    by,
    now
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
