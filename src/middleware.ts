import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/api/auth"];

// Routes that require specific module access
const PROTECTED_ROUTES: Record<string, { module: string; tab?: string }> = {
  "/queue": { module: "cms", tab: "queue" },
  "/enrollment": { module: "cms", tab: "enrollment" },
  "/payment": { module: "cms", tab: "payment" },
  "/results": { module: "cms", tab: "results" },
  "/clinical": { module: "cms", tab: "clinical" },
  "/reports": { module: "cms", tab: "reports" },
  "/settings": { module: "cms", tab: "settings" },
  "/eros": { module: "erosui" },
};

// Cron/API routes that require a secret token instead of user auth
const CRON_ROUTES = ["/api/cron"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protect cron routes with secret token
  if (CRON_ROUTES.some((route) => pathname.startsWith(route))) {
    const cronSecret = request.headers.get("x-cron-secret");
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Check for auth token/session (Auth.js v5 uses "authjs.session-token")
  const token =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Note: Detailed role checking happens at the page/API level via requireAuth()
  // because middleware can't decode JWT without the secret (edge runtime limitation).
  // The middleware handles the basic auth redirect; RBAC is enforced in server components.

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
