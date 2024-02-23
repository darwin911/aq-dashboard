import { NextResponse } from "next/server";
import IPinfoWrapper, { IPinfo } from "node-ipinfo";
import { NextRequest } from "next/server";
import { unstable_noStore } from "next/cache";

const token = process.env.IPINFO_TOKEN;
const ipinfoWrapper = new IPinfoWrapper(token);

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  console.log("\n** GET /ip Running **\n");
  unstable_noStore();

  const ip = request.ip;
  const headerIp = request.headers.get("x-forwarded-for");

  console.log({ ip });
  if (ip || headerIp) {
    const ipInfo: IPinfo = await ipinfoWrapper.lookupIp(String(ip || headerIp));

    console.log({ ipInfo });
    if (ipInfo) {
      return NextResponse.json(ipInfo);
    }
  }

  return NextResponse.json({
    message: "Failed to find a valid ip",
    ip: ip ? ip : "N/A",
    headerIp: headerIp ? headerIp : "N/A",
  });
}
