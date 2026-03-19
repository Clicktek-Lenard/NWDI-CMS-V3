import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";

/**
 * GET /api/kiosk/services?tool=ping&branch=DTU&cmd=Ping
 * Diagnostic services tool — ping, check IP, jasper, socket, SQL, HL7.
 * All tools are informational/status checks only.
 */
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "queue");

  const { searchParams } = new URL(request.url);
  const tool   = searchParams.get("tool") ?? "ping";
  const branch = searchParams.get("branch") ?? "";
  const cmd    = searchParams.get("cmd") ?? "";

  let result = "";

  switch (tool) {
    case "ping": {
      result = [
        `Tool: Ping`,
        `Branch: ${branch || "(none selected)"}`,
        `Command: ${cmd || "(none selected)"}`,
        ``,
        `Note: Live ping requires server-side execution.`,
        `To enable live ping results, configure a backend ping service`,
        `and update this endpoint to call it.`,
      ].join("\n");
      break;
    }
    case "checkip": {
      // Return the client's IP as seen by the server
      const forwarded = request.headers.get("x-forwarded-for");
      const realIp    = request.headers.get("x-real-ip");
      const ip        = forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown";
      result = [
        `Your IP address (as seen by the server):`,
        ``,
        `  ${ip}`,
        ``,
        `Branch: ${branch || "(none selected)"}`,
        `Command: ${cmd || "(none selected)"}`,
        ``,
        `Note: If behind a proxy or load balancer, this may show`,
        `the proxy IP. Configure TrustProxies to see the real client IP.`,
      ].join("\n");
      break;
    }
    case "jasper": {
      result = [
        `Tool: Jasper Server Status`,
        `Branch: ${branch || "(none selected)"}`,
        ``,
        `Configure the Jasper Server URL in your .env file:`,
        `  JASPER_SERVER_URL=http://your-jasper-server:8080`,
        ``,
        `Then update this endpoint to perform an HTTP health check.`,
      ].join("\n");
      break;
    }
    case "socket": {
      result = [
        `Tool: Socket Server Status`,
        `Branch: ${branch || "(none selected)"}`,
        ``,
        `Configure the Socket.io server URL in your .env file:`,
        `  SOCKET_SERVER_URL=http://your-socket-server:3001`,
        ``,
        `Then update this endpoint to check socket connectivity.`,
      ].join("\n");
      break;
    }
    case "sql": {
      result = [
        `Tool: SQL / Database Status`,
        `Branch: ${branch || "(none selected)"}`,
        ``,
        `Database: PostgreSQL`,
        `Host: (configured via DATABASE_URL)`,
        `Status: Connected (if this page loaded, the DB is reachable)`,
      ].join("\n");
      break;
    }
    case "hl7": {
      result = [
        `Tool: HL7 Interface Status`,
        `Branch: ${branch || "(none selected)"}`,
        ``,
        `Configure the HL7 endpoint in your .env file:`,
        `  HL7_SERVER_URL=http://your-hl7-server`,
        ``,
        `Then update this endpoint to check HL7 connectivity.`,
      ].join("\n");
      break;
    }
    default:
      result = `Unknown tool: ${tool}`;
  }

  return NextResponse.json({ result });
}
