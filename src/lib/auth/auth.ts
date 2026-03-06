import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
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
          const conn = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "cms_v2",
          });

          const [rows] = await conn.query<mysql.RowDataPacket[]>(
            "SELECT id, username, email, password, first_name, last_name, role FROM users WHERE username = ? AND deleted_at IS NULL AND activated = 1 LIMIT 1",
            [username]
          );

          await conn.end();

          const user = rows[0];
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

