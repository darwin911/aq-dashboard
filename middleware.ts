import { NextResponse } from "next/server";
import IPinfoWrapper, { IPinfo, AsnResponse } from "node-ipinfo";
import { NextRequest } from "next/server";

const token = process.env.IPINFO_TOKEN;
const ipinfoWrapper = new IPinfoWrapper(token);

export async function middleware(request: NextRequest) {
  console.log("\n** Middleware Running **\n");

  const ip = request.ip || request.headers.get("x-forwarded-for");
  if (ip) {
    const ipInfo: IPinfo = await ipinfoWrapper.lookupIp(ip);

    console.log(ipInfo);
  }
}

export const config = {
  matcher: ["/"],
};
