import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("\n** Middleware Running **\n");

  console.log({
    requestIp: request.ip,
    requestHeaderXForwardedFor: request.headers.get("x-forwarded-for"),
  });
}

export const config = {
  matcher: ["/"],
};
