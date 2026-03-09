import prisma from "@/lib/db/prisma";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage() {
  const rawClinics = await prisma.businessunits.findMany({
    where:   { Status: "1" },
    select:  { Code: true, Description: true },
    orderBy: { Code: "asc" },
  });

  const clinics = rawClinics
    .filter((c) => c.Code !== null)
    .map((c) => ({ Code: c.Code as string, Description: c.Description }));

  return <LoginForm clinics={clinics} />;
}
