import { notFound } from "next/navigation";
import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { PaymentForm } from "@/components/payment/payment-form";
import prisma from "@/lib/db/prisma";

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth(CMS_MODULES.PAYMENT.module, CMS_MODULES.PAYMENT.tab);
  const { id } = await params;
  const queueId = BigInt(id);

  const [queue, transactions, statuses] = await Promise.all([
    prisma.queue.findUnique({ where: { Id: queueId } }),
    prisma.transactions.findMany({ where: { IdQueue: queueId }, orderBy: { Id: "asc" } }),
    prisma.queuestatus.findMany({ orderBy: { Id: "asc" } }),
  ]);

  if (!queue) notFound();

  const statusMap = new Map(statuses.map((s) => [s.Id, s.Name]));

  const queueData = {
    id:          Number(queue.Id),
    code:        queue.Code ?? "",
    patientName: queue.QFullName  ?? "",
    patientType: queue.PatientType ?? "",
    status:      queue.Status,
    statusName:  statusMap.get(queue.Status) ?? String(queue.Status),
    dateTime:    queue.DateTime?.toISOString() ?? queue.Date.toISOString(),
  };

  const txData = transactions.map((tx) => ({
    id:                   Number(tx.Id),
    idDoctor:             tx.IdDoctor ? Number(tx.IdDoctor) : null,
    nameDoctor:           tx.NameDoctor ?? "",
    nameCompany:          tx.NameCompany ?? "",
    codeItemPrice:        tx.CodeItemPrice ?? "",
    descriptionItemPrice: tx.DescriptionItemPrice ?? "",
    priceGroupItemPrice:  tx.PriceGroupItemPrice ?? "",
    amount:               tx.AmountItemPrice ? Number(tx.AmountItemPrice) : 0,
    amountRemaining:      tx.AmountRemaining ? Number(tx.AmountRemaining) : 0,
    transactionType:      tx.TransactionType ?? "",
    status:               tx.Status ?? 0,
    statusName:           statusMap.get(tx.Status ?? 0) ?? String(tx.Status),
  }));

  // -m-6 cancels the dashboard layout's p-6 so PaymentForm fills the viewport
  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      <PaymentForm queue={queueData} transactions={txData} />
    </div>
  );
}
