import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Pool } from "pg";
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

        try {
          const pool = new Pool({ connectionString: process.env.DATABASE_URL });

          const result = await pool.query<{
            id: number;
            username: string;
            email: string | null;
            password: string | null;
            first_name: string | null;
            last_name: string | null;
            role: string | null;
          }>(
            "SELECT id, username, email, password, first_name, last_name, role FROM users WHERE username = $1 AND deleted_at IS NULL AND activated = true LIMIT 1",
            [username]
          );

          await pool.end();

          const user = result.rows[0];
          if (!user) return null;

          // Support both $2b$ (Node.js) and $2y$ (PHP) bcrypt hashes
          const hash = (user.password as string) ?? "";
          const normalizedHash = hash.startsWith("$2y$") ? hash.replace("$2y$", "$2b$") : hash;
          const isValid = await bcrypt.compare(password, normalizedHash);
          if (!isValid) return null;

          return {
            id: String(user.id),
            name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
            email: user.email || "",
            role: user.role || "",
            clinicCode,
          };
        } catch (err) {
          console.error("[auth] authorize error:", err);
          return null;
        }
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
