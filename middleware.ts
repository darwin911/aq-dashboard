import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("\n** Middleware Running **\n");
}

export const config = {
  matcher: ["/"],
};
