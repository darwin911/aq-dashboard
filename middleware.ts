import { geoDataType } from "@/app/api/aq/route";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.url.includes("?")) {
    return NextResponse.next();
  }

  let ip = request.headers.get("x-forwarded-for");
  let geo: any = null;

  if (ip && ip.split(",")[0] !== "::1") {
    ip = ip.split(",")[0];
  }

  console.log({ ip });

  if (ip && ip !== "::1") {
    const res = await fetch(`http://ipinfo.io/${ip}/json`);
    if (!res.ok) {
      throw new Error(
        "Something went wrong when fetching ip geolocation data."
      );
    }

    const data = await res.json();
    console.log("\nGeo:", data, "\n");
    geo = new URLSearchParams(data);
  }

  console.log("\nGeo", geo, "\n");

  //   const TEMP = new URLSearchParams({
  //     city: "philly",
  //     country: "Armenia",
  //     lat: "2.233",
  //     lon: "-1.233",
  //   });

  if (!geo) {
    console.log("No Geo data found");
    return NextResponse.next();
  }

  const example = {
    ip: "212.102.51.243",
    hostname: "unn-212-102-51-243.cdn77.com",
    city: "Tokyo",
    region: "Tokyo",
    country: "JP",
    loc: "35.6895,139.6917",
    org: "AS212238 Datacamp Limited",
    postal: "101-8656",
    timezone: "Asia/Tokyo",
    readme: "https://ipinfo.io/missingauth",
  };

  console.log(
    "Redirecting!",
    new URL(`/?${geo.toString()}}`, request.url).toString()
  );

  return NextResponse.redirect(
    new URL(`/?${geo.toString()}`, request.url).toString()
  );
}

export const config = {
  matcher: "/",
};