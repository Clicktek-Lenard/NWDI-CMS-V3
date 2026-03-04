import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      clinicCode: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    role?: string;
    clinicCode?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    role?: string;
    clinicCode?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        clinicCode: { label: "Clinic", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const username = credentials.username as string;
        const password = credentials.password as string;
        const clinicCode = (credentials.clinicCode as string) || "";

        console.log("[authorize] attempt →", { username, clinicCode });

        // Demo accounts (remove in production)
        const demoUsers: Record<string, { password: string; name: string; email: string; role: string }> = {
          admin: {
            password: "admin123",
            name: "Admin User",
            email: "admin@nwdi.ad",
            role: "[DEVTEAM]\n[USERCMS]\n[USEREROS]",
          },
          nurse: {
            password: "nurse123",
            name: "Maria Santos",
            email: "msantos@nwdi.ad",
            role: "[QUEUE]\n[VITAL-SIGN]\n[KIOSK-NURSE]",
          },
          cashier: {
            password: "cashier123",
            name: "Juan Reyes",
            email: "jreyes@nwdi.ad",
            role: "[QUEUE]\n[PAYMENT]\n[REPORTS-DAILYSALES]",
          },
        };

        if (demoUsers[username] && demoUsers[username].password === password) {
          const demo = demoUsers[username];
          return {
            id: username,
            username,
            name: demo.name,
            email: demo.email,
            role: demo.role,
            clinicCode,
          };
        }

        // Step 1: Try LDAP authentication
        const ldapUser = await authenticateWithLDAP(username, password);

        if (ldapUser) {
          // Find or create user from LDAP
          let user = await prisma.user.findFirst({
            where: {
              username,
              deleted_at: null,
              activated: true,
            },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                username,
                email: ldapUser.email || "",
                first_name: ldapUser.firstName || "",
                last_name: ldapUser.lastName || "",
                password: await bcrypt.hash(password, 10),
                activated: true,
                ldap_import: true,
                show_in_list: false,
                two_factor_enrolled: false,
                two_factor_optin: false,
              },
            });
          } else if (user.ldap_import === true) {
            // Sync password for LDAP users
            await prisma.user.update({
              where: { id: user.id },
              data: { password: await bcrypt.hash(password, 10) },
            });
          }

          return {
            id: String(user.id),
            username: user.username || username,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email || "",
            role: user.role ?? "",
            clinicCode,
          };
        }

        // Step 2: Fallback to local authentication
        const user = await prisma.user.findFirst({
          where: {
            username,
            deleted_at: null,
            activated: true,
          },
        });

        if (!user) return null;

        const isValidPassword = await bcrypt.compare(password, user.password ?? "");
        if (!isValidPassword) return null;

        return {
          id: String(user.id),
          username: user.username || username,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email || "",
          role: user.role ?? "",
          clinicCode,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username ?? "";
        token.role = user.role ?? "";
        token.clinicCode = user.clinicCode ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.username = (token.username as string) ?? "";
        session.user.role = (token.role as string) ?? "";
        session.user.clinicCode = (token.clinicCode as string) ?? "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
});

// --- LDAP Authentication ---
interface LDAPUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  memberOf: string[];
}

async function authenticateWithLDAP(
  username: string,
  password: string
): Promise<LDAPUser | null> {
  // TODO: Implement LDAP authentication
  // Install ldapjs: npm install ldapjs @types/ldapjs
  //
  // Example implementation:
  // const ldap = require("ldapjs");
  // const client = ldap.createClient({ url: process.env.LDAP_SERVER });
  //
  // const userDn = `${username}@${process.env.LDAP_DOMAIN}`;
  // await client.bind(userDn, password);
  //
  // const searchResult = await client.search(process.env.LDAP_BASE_DN, {
  //   filter: `(sAMAccountName=${ldap.escape(username)})`,  // SAFE: escaped
  //   scope: "sub",
  // });
  //
  // return parsed user object;

  console.log(`LDAP auth not configured for user: ${username}`);
  return null;
}
