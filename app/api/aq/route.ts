import { NextResponse } from "next/server";

import { NextRequest } from "next/server";
import { unstable_noStore } from "next/cache";
import { AQ_INDEX, PARAMETERS } from "@/lib/shared";
import { MeasurementsResponse, geoDataType } from "@/lib/types";
import { getNO2orSO2, getO3Index, getPM10, getPM25orUM100 } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  unstable_noStore();
  console.log("\n** GET /aq Running **\n");

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

  const params = new URL(request.url).searchParams;
  let lat = params.get("lat");
  let lon = params.get("long");

  if (lat) {
    lat = Number(lat).toFixed(3);
  }

  if (lon) {
    lon = Number(lon).toFixed(3);
  }

  if (!lat || !lon) {
    throw new Error("Latitude and Longitude are required to fetch Air Quality");
  }

  const baseUrl = "https://api.openaq.org/v2";

  const airQualityUrl = `${baseUrl}/measurements?&limit=24&page=1&offset=0&sort=desc&coordinates=${lat}%2C${lon}&radius=10000&order_by=datetime`;

  console.log({ airQualityUrl });

  try {
    const aqRes = await fetch(airQualityUrl, {
      headers: { "Content-Type": "application/json" },
    });

    if (!aqRes.ok) {
      return NextResponse.json({
        message: "Failed to find AQ Data. Response NOT OK",
      });
    }

    const data: MeasurementsResponse = await aqRes.json();

    console.debug(
      data.results.map((r) => ({
        value: r.value,
        unit: r.unit,
        parameter: r.parameter,
      }))
    );

    if (data.results.length) {
      const latestMeasurement = data.results[0];

      let AQIndex: (typeof AQ_INDEX)[keyof typeof AQ_INDEX] | "N/A" = "N/A";

      if (latestMeasurement.parameter === PARAMETERS.O3) {
        AQIndex = getO3Index(data);
      } else if (
        latestMeasurement.parameter === PARAMETERS.PM25 ||
        latestMeasurement.parameter === PARAMETERS.UM100
      ) {
        AQIndex = getPM25orUM100(data);
      } else if (latestMeasurement.parameter === PARAMETERS.PM10) {
        AQIndex = getPM10(data);
      } else if (
        latestMeasurement.parameter === PARAMETERS.NO2 ||
        latestMeasurement.parameter === PARAMETERS.SO2
      ) {
        AQIndex = getNO2orSO2(data);
      }

      const locationId = latestMeasurement.locationId;

      if (locationId) {
        try {
          const locationResponse = await fetch(
            `https://api.openaq.org/v2/locations/${locationId}`,
            { headers: { "Content-Type": "application/json" } }
          );

          if (!locationResponse.ok) {
            return NextResponse.json({
              message: "Failed to find AQ Data. LOCATION Response NOT OK",
            });
          }

          const locationData: {
            results: {
              id: number;
              city: string;
              country: string;
            }[];
          } = await locationResponse.json();

          const cityLocation = locationData.results[0].city;

          return NextResponse.json({
            ...latestMeasurement,
            city: cityLocation ?? "N/A",
            aqIndex: AQIndex,
            ip: ip,
            geo: { lat, long: lon },
          });
        } catch (error) {
          console.error("Error", error);
        }
      }

      return NextResponse.json(latestMeasurement);
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
