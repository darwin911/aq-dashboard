import { NextResponse } from "next/server";
import IPinfoWrapper, { IPinfo } from "node-ipinfo";
import { NextRequest } from "next/server";

const token = process.env.IPINFO_TOKEN;
const ipinfoWrapper = new IPinfoWrapper(token);

export async function GET(request: NextRequest) {
  console.log("\n** GET / Running **\n");

  const ip = request.ip;

  console.log({ ip });
  if (ip) {
    const ipInfo: IPinfo = await ipinfoWrapper.lookupIp(ip);

    console.log(ipInfo);
    return NextResponse.redirect(new URL(`/aq/${ipInfo.ip}`, request.url));
  }

  return NextResponse.redirect("/404");
}
