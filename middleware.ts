import { geoDataType } from "@/app/api/aq/route";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let ip = request.headers.get("x-forwarded-for");
  let geo: geoDataType = null;

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
    geo = data;
  }

  console.log("\nGeo", geo, "\n");

  return NextResponse.json({ message: "middleware running", geo, ip });
}

export const config = {
  matcher: "/",
};
