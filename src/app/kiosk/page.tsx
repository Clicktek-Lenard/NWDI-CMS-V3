import { KioskDisplay } from "@/components/kiosk/kiosk-display";

// Public page — no auth required (TV display board)
export default function KioskPage({
  searchParams,
}: {
  searchParams: Promise<{ clinic?: string }>;
}) {
  return (
    <KioskDisplayWrapper searchParams={searchParams} />
  );
}

async function KioskDisplayWrapper({
  searchParams,
}: {
  searchParams: Promise<{ clinic?: string }>;
}) {
  const sp = await searchParams;
  return <KioskDisplay clinicCode={sp.clinic} />;
}
