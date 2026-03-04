import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      clinicCode: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    clinicCode?: string;
  }

  interface JWT {
    id?: string;
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

        // Step 1: Try LDAP authentication
        const ldapUser = await authenticateWithLDAP(username, password);

        if (ldapUser) {
          // Find or create user from LDAP
          let user = await prisma.user.findFirst({
            where: {
              username,
              deleted_at: null,
              activated: 1,
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
                activated: 1,
                ldap_import: 1,
              },
            });
          } else if (user.ldap_import === 1) {
            // Sync password for LDAP users
            await prisma.user.update({
              where: { id: user.id },
              data: { password: await bcrypt.hash(password, 10) },
            });
          }

          return {
            id: String(user.id),
            name: `${user.first_name} ${user.last_name}`,
            email: user.email || "",
            role: user.role || "",
            clinicCode,
          };
        }

        // Step 2: Fallback to local authentication
        const user = await prisma.user.findFirst({
          where: {
            username,
            deleted_at: null,
            activated: 1,
          },
        });

        if (!user) return null;

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return null;

        return {
          id: String(user.id),
          name: `${user.first_name} ${user.last_name}`,
          email: user.email || "",
          role: user.role || "",
          clinicCode,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "";
        token.clinicCode = user.clinicCode ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.clinicCode = token.clinicCode as string;
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
