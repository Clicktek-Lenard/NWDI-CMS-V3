import { notFound } from "next/navigation";
import { requireAuth, CMS_MODULES, parseUserRoles } from "@/lib/auth/rbac";
import { EditQueueForm } from "@/components/queue/edit-queue-form";
import prisma from "@/lib/db/prisma";

export default async function PastQueueEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth(CMS_MODULES.QUEUE.module, CMS_MODULES.QUEUE.tab);
  const userRoles = parseUserRoles(session.user.role ?? null);
  const isBmRole           = userRoles.includes("[BM-ROLE]");
  const isResultsReleasing = userRoles.includes("[RESULTS-RELEASING]");
  const isPayment          = isBmRole || userRoles.includes("[PAYMENT]") || userRoles.includes("[PASTPAYMENT]") || userRoles.includes("[USERCMS]") || userRoles.includes("[DEVTEAM]");
  const isCsrView          = userRoles.includes("[CMS-CSR-VIEW]");
  const isHl7Btn           = userRoles.includes("[HL7BTN]");

  const { id } = await params;
  const queueId = BigInt(id);

  const [queue, transactions, vitals, statuses, msgQueueRows] = await Promise.all([
    prisma.queue.findUnique({ where: { Id: queueId } }),
    prisma.transactions.findMany({ where: { IdQueue: queueId }, orderBy: { Id: "asc" } }),
    prisma.vitals.findFirst({ where: { IdQueue: queueId } }),
    prisma.queuestatus.findMany({ orderBy: { Id: "asc" } }),
    prisma.msg_queue.findMany({ where: { IdQueue: queueId, Status: "1" } }),
  ]);

  if (!queue) notFound();

  const queueData = {
    id:          Number(queue.Id),
    code:        queue.Code ?? "",
    idBU:        queue.IdBU ?? "",
    idPatient:   Number(queue.IdPatient),
    patientName: queue.QFullName  ?? "",
    lastName:    queue.QLastName  ?? "",
    firstName:   queue.QFirstName ?? "",
    middleName:  queue.QMiddleName ?? "",
    gender:      queue.QGender    ?? "",
    dob:         queue.QDOB?.toISOString().split("T")[0] ?? null,
    age:         queue.AgePatient,
    status:      queue.Status,
    patientType: queue.PatientType ?? "",
    accessionNo: queue.AccessionNo ?? "",
    notes:       queue.Notes ?? "",
    inputBy:     queue.InputBy ?? "",
    dateTime:    queue.DateTime?.toISOString() ?? queue.Date?.toISOString() ?? "",
  };

  const statusMap = new Map(statuses.map((s) => [s.Id, s.Name ?? ""]));

  const txData = transactions.map((tx) => ({
    id:                   Number(tx.Id),
    idDoctor:             tx.IdDoctor ? Number(tx.IdDoctor) : null,
    nameDoctor:           tx.NameDoctor ?? "",
    idCompany:            tx.IdCompany ?? 0,
    nameCompany:          tx.NameCompany ?? "",
    transactionType:      tx.TransactionType ?? "",
    codeItemPrice:        tx.CodeItemPrice ?? "",
    descriptionItemPrice: tx.DescriptionItemPrice ?? "",
    amount:               tx.AmountItemPrice ? Number(tx.AmountItemPrice) : 0,
    cardNumber:           tx.HCardNumber ?? "",
    inputBy:              tx.InputBy ?? "",
    status:               tx.Status,
    statusName:           statusMap.get(tx.Status) ?? String(tx.Status),
    groupItemMaster:      tx.GroupItemMaster ?? tx.CodeItemPrice ?? "",
  }));

  const vitalsData = vitals
    ? {
        medication: vitals.Medication ?? "",
        lastDose:   vitals.LastDose ? vitals.LastDose.toISOString().slice(0, 16) : "",
        lastPeriod: vitals.LastPeriod ? vitals.LastPeriod.toISOString().split("T")[0] : "",
      }
    : { medication: "", lastDose: "", lastPeriod: "" };

  const statusList = statuses.map((s) => ({ id: s.Id, name: s.Name ?? "" }));

  const hl7SentGroups = msgQueueRows
    .map((r) => r.ItemGroup ?? "")
    .filter(Boolean);

  return (
    <EditQueueForm
      queue={queueData}
      transactions={txData}
      vitals={vitalsData}
      statuses={statusList}
      isBmRole={isBmRole}
      isResultsReleasing={isResultsReleasing}
      isPayment={isPayment}
      isCsrView={isCsrView}
      isHl7Btn={isHl7Btn}
      hl7SentGroups={hl7SentGroups}
    />
  );
}
