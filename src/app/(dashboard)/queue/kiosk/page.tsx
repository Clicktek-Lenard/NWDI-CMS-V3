import { requireAuth, parseUserRoles, hasAccess } from "@/lib/auth/rbac";
import { KioskLandingClient } from "@/components/kiosk/kiosk-landing-client";

export default async function KioskPage() {
  const session = await requireAuth("cms", "queue");
  const roles = parseUserRoles(session.user.role ?? null);

  const departments = [
    {
      key: "reception",
      label: "Reception",
      href: "/queue/kiosk/reception",
      department: "Reception",
      color: "blue",
      allowed: hasAccess(roles, "kiosk", "receptionqueue"),
    },
    {
      key: "extraction",
      label: "Laboratory / Extraction",
      href: "/queue/kiosk/extraction",
      department: "Extraction",
      color: "purple",
      allowed: hasAccess(roles, "kiosk", "extractionqueue"),
    },
    {
      key: "imaging",
      label: "Imaging",
      href: "/queue/kiosk/imaging",
      department: "Imaging",
      color: "indigo",
      allowed: hasAccess(roles, "kiosk", "imagingqueue"),
    },
    {
      key: "vitalsigns",
      label: "Vital Signs",
      href: "/queue/kiosk/vitalsigns",
      department: "Vital Signs",
      color: "emerald",
      allowed: hasAccess(roles, "kiosk", "vitalsignsqueue"),
    },
    {
      key: "consultation",
      label: "Consultation",
      href: "/queue/kiosk/consultation",
      department: "Consultation",
      color: "amber",
      allowed: hasAccess(roles, "kiosk", "consultationqueue"),
    },
    {
      key: "releasing",
      label: "Releasing",
      href: "/queue/kiosk/releasing",
      department: "Releasing",
      color: "rose",
      allowed: hasAccess(roles, "kiosk", "releasingqueue"),
    },
  ];

  return <KioskLandingClient departments={departments} />;
}
