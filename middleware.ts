import { AQ_INDEX, PARAMETERS } from "@/lib/shared";
import { MeasurementsResponse, geoDataType } from "@/lib/types";
import { getNO2orSO2, getO3Index, getPM10, getPM25orUM100 } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.url.includes("?")) {
    return NextResponse.next();
  }
  let ip = request.headers.get("x-forwarded-for");
  //   let ip = "212.8.250.217";
  //   let ip = "2601:46:57f:3b50:e010:430:ce0c:1954";
  let geo: geoDataType = null;

  if (ip && ip.split(",")[0] !== "::1") {
    ip = ip.split(",")[0];
  }

  console.debug({ ip });

  if (ip && ip !== "::1") {
    const res = await fetch(`http://ipinfo.io/${ip}/json`);
    if (!res.ok) {
      throw new Error(
        "Something went wrong when fetching ip geolocation data."
      );
    }

    const data: geoDataType = await res.json();
    geo = data;
  }

  console.debug("\nGeo", geo, "\n");

  if (!geo) {
    console.debug("No Geo data found");
    return NextResponse.next();
  }
  let search = new URLSearchParams(geo);

  search.delete("readme");

  const [geoLat, geoLong] = geo["loc"].split(",");

  const openaqURL = `https://api.openaq.org/v2/measurements?limit=300&page=1&offset=0&sort=desc&coordinates=${Number(
    geoLat
  ).toFixed(3)}%2C${Number(geoLong).toFixed(3)}`;

  console.log({ openaqURL });

  const openaqResponse = await fetch(openaqURL, {
    headers: { "Content-Type": "application/json" },
  });

  const aqData: MeasurementsResponse = await openaqResponse.json();

  if (!openaqResponse.ok) {
    return NextResponse.json({
      message: "Failed to find AQ Data. Response NOT OK",
    });
  }

  const cleanResults = aqData.results.filter((result) => result.value > 0);

  if (cleanResults.length) {
    let AQIndex: (typeof AQ_INDEX)[keyof typeof AQ_INDEX] | "N/A" = "N/A";

    const latestMeasurement = cleanResults[0];

    console.log({ latestMeasurement });

    switch (latestMeasurement.parameter) {
      case PARAMETERS.O3:
        AQIndex = getO3Index(cleanResults);

      case PARAMETERS.PM25:
      case PARAMETERS.UM100:
        AQIndex = getPM25orUM100(cleanResults);

      case PARAMETERS.PM10:
        AQIndex = getPM10(cleanResults);

      case PARAMETERS.NO2:
      case PARAMETERS.SO2:
        AQIndex = getNO2orSO2(cleanResults);

      default:
        break;
    }

    if (AQIndex === "N/A") {
      return NextResponse.next();
    }

    search.append("aqi", AQIndex);

    return NextResponse.redirect(
      new URL(`?${new URLSearchParams(search).toString()}`, request.url)
    );
  }

  return NextResponse.redirect(
    new URL(`/?${new URLSearchParams(search).toString()}`, request.url)
  );
}

export const config = {
  matcher: "/",
};
