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
  // if (ip) {
  //   const ipInfo: IPinfo = await ipinfoWrapper.lookupIp(ip);

  //   console.log(ipInfo);
  //   if (ipInfo) {
  //     return ipInfo;
  //   }
  // }
  return NextResponse.json({
    message: "Endpoint IP working?",
    ip: ip ? ip : "N/A",
    headerIp: headerIp ? headerIp : "N/A",
  });
}
