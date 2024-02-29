import { NextResponse } from "next/server";

import { NextRequest } from "next/server";
import { unstable_noStore } from "next/cache";
import { AQ_INDEX, PARAMETERS } from "@/lib/shared";
import { AQIndexType, MeasurementsResponse, geoDataType } from "@/lib/types";
import { getNO2orSO2, getO3Index, getPM10, getPM25orUM100 } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  unstable_noStore();
  console.log("\n** GET /aq Running **\n");

  const searchParams = new URL(request.url).searchParams;

  const lat = searchParams.get("lat") ?? "";
  const lon = searchParams.get("lon") ?? "";

  console.log(searchParams);
  console.log({ lat, lon });

  const openaqURL = `https://api.openaq.org/v2/measurements?limit=1000&page=1&offset=0&sort=desc&radius=20000&coordinates=${lat}%2C${lon}`;

  console.log({ openaqURL });

  try {
    const openaqResponse = await fetch(openaqURL, {
      headers: { "Content-Type": "application/json" },
    });

    if (!openaqResponse.ok) {
      return NextResponse.json({
        message: "Failed to find AQ Data. Response NOT OK",
      });
    }

    const aqData: MeasurementsResponse = await openaqResponse.json();

    // console.debug(
    //   aqData.results.map((r) => ({
    //     value: r.value,
    //     unit: r.unit,
    //     parameter: r.parameter,
    //   }))
    // );

    const cleanResults = aqData.results.filter((result) => result.value >= 0);

    if (cleanResults.length) {
      let AQIndex: AQIndexType = "N/A";
      const latestMeasurement = cleanResults[0];
      console.log({ latestMeasurement, clean: cleanResults.length });

      switch (latestMeasurement.parameter) {
        case PARAMETERS.O3:
          AQIndex = getO3Index(cleanResults);
        case PARAMETERS.PM25:
        case PARAMETERS.UM100:
          console.log("evaluating pm25");
          AQIndex = getPM25orUM100(cleanResults);
        case PARAMETERS.PM10:
          AQIndex = getPM10(cleanResults);
        case PARAMETERS.NO2:
        case PARAMETERS.SO2:
          AQIndex = getNO2orSO2(cleanResults);
      }

      console.log({ AQIndex });

      if (AQIndex === "N/A") {
        return NextResponse.json({
          message: "Failed to find AQ Data",
        });
      }

      return NextResponse.json({
        aqi: AQIndex,
        station: latestMeasurement.location,
        country: latestMeasurement.country,
      });
    }

    return NextResponse.json({ message: "Air Quality data not found" });
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json({
      message: "Failed to find AQ Data",
      error: error,
    });
  }
}
