import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import { auth } from "@/lib/auth/auth";

const CLINIC_NAMES: Record<string, string> = {
  CEN: "Central",
  SMB: "San Miguel",
  SRL: "SRL",
  TAR: "Tarlac",
  LIN: "Lingayen",
  PAR: "Paranaque",
  DTU: "DTU",
  BAY: "Bayombong",
  BAE: "Baguio",
  DAG: "Dagupan",
  MIR: "Mira-Nila",
  ORT: "Ortho",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userName = session?.user?.name || "User";
  const clinicCode = session?.user?.clinicCode || "";
  const clinicName = CLINIC_NAMES[clinicCode] || clinicCode || "—";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main content area */}
      <div className="lg:pl-64">
        <Header userName={userName} clinicName={clinicName} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
