import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import { requireAuth } from "@/lib/auth/rbac";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  const userName = session.user.name ?? session.user.id ?? "User";
  const clinicCode = session.user.clinicCode ?? "";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main content area */}
      <div className="lg:pl-64">
        <Header userName={userName} clinicName={clinicCode} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
