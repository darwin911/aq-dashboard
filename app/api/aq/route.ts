import { NextResponse } from "next/server";

import { NextRequest } from "next/server";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";

export type MeasurementsResponse = {
  meta: { name: string };
  results: {
    locationId: number;
    location: string;
    parameter: string;
    value: number;
    date: { utc: string; local: string };
    unit: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    country: string;
    isMobile: boolean;
    entity: string;
    sensorType: string;
  }[];
};

const PARAMETERS = {
  O3: "o3",
  PM25: "pm25",
  PM10: "pm10",
  NO2: "no2",
  SO2: "so2",
  UM100: "um100",
};

const AQ_INDEX = {
  GOOD: "Good" as const,
  MODERATE: "Moderate" as const,
  UNHEALTHY_FOR_SENSITIVE: "Unhealthy for Sensitive Groups" as const,
  UNHEALTHY: "Unhealthy" as const,
  VERY_UNHEALTHY: "Very Unhealthy" as const,
  HAZARDOUS: "Hazardous" as const,
};

export type geoDataType = {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
  readme: string;
} | null;

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
        const avgLastEightHour =
          data.results
            .slice(0, 8)
            .reduce((acc, result) => acc + result.value, 0) / 8;

        if (avgLastEightHour >= 0 && avgLastEightHour <= 0.054) {
          AQIndex = AQ_INDEX.GOOD;
        } else if (avgLastEightHour >= 0.055 && avgLastEightHour <= 0.07) {
          AQIndex = AQ_INDEX.MODERATE;
        } else if (avgLastEightHour >= 0.071 && avgLastEightHour <= 0.085) {
          AQIndex = AQ_INDEX.UNHEALTHY_FOR_SENSITIVE;
        } else if (avgLastEightHour >= 0.071 && avgLastEightHour <= 0.085) {
          AQIndex = AQ_INDEX.UNHEALTHY;
        } else if (avgLastEightHour >= 0.071 && avgLastEightHour <= 0.085) {
          AQIndex = AQ_INDEX.VERY_UNHEALTHY;
        } else {
          AQIndex = AQ_INDEX.HAZARDOUS;
        }
      } else if (
        latestMeasurement.parameter === PARAMETERS.PM25 ||
        latestMeasurement.parameter === PARAMETERS.UM100
      ) {
        const avgLastTwentyFourHour =
          data.results
            .slice(0, 24)
            .reduce((acc, result) => acc + result.value, 0) / 24;

        if (avgLastTwentyFourHour >= 0 && avgLastTwentyFourHour <= 12.0) {
          AQIndex = AQ_INDEX.GOOD;
        } else if (
          avgLastTwentyFourHour >= 12.1 &&
          avgLastTwentyFourHour <= 35.4
        ) {
          AQIndex = AQ_INDEX.MODERATE;
        } else if (
          avgLastTwentyFourHour >= 35.5 &&
          avgLastTwentyFourHour <= 55.4
        ) {
          AQIndex = AQ_INDEX.UNHEALTHY_FOR_SENSITIVE;
        } else if (
          avgLastTwentyFourHour >= 55.5 &&
          avgLastTwentyFourHour <= 150.4
        ) {
          AQIndex = AQ_INDEX.UNHEALTHY;
        } else if (
          avgLastTwentyFourHour >= 150.5 &&
          avgLastTwentyFourHour <= 250.4
        ) {
          AQIndex = AQ_INDEX.VERY_UNHEALTHY;
        } else {
          AQIndex = AQ_INDEX.HAZARDOUS;
        }
      } else if (latestMeasurement.parameter === PARAMETERS.PM10) {
        const avgLastTwentyFourHour =
          data.results
            .slice(0, 24)
            .reduce((acc, result) => acc + result.value, 0) / 24;

        if (avgLastTwentyFourHour >= 0 && avgLastTwentyFourHour <= 54) {
          AQIndex = AQ_INDEX.GOOD;
        } else if (
          avgLastTwentyFourHour >= 55 &&
          avgLastTwentyFourHour <= 154
        ) {
          AQIndex = AQ_INDEX.MODERATE;
        } else if (
          avgLastTwentyFourHour >= 155 &&
          avgLastTwentyFourHour <= 254
        ) {
          AQIndex = AQ_INDEX.UNHEALTHY_FOR_SENSITIVE;
        } else if (
          avgLastTwentyFourHour >= 255 &&
          avgLastTwentyFourHour <= 354
        ) {
          AQIndex = AQ_INDEX.UNHEALTHY;
        } else if (
          avgLastTwentyFourHour >= 355 &&
          avgLastTwentyFourHour <= 424
        ) {
          AQIndex = AQ_INDEX.VERY_UNHEALTHY;
        } else {
          AQIndex = AQ_INDEX.HAZARDOUS;
        }
      } else if (
        latestMeasurement.parameter === PARAMETERS.NO2 ||
        latestMeasurement.parameter === PARAMETERS.SO2
      ) {
        const last = data.results[0];

        if (last.value >= 0 && last.value <= 53) {
          AQIndex = AQ_INDEX.GOOD;
        } else if (last.value >= 54 && last.value <= 100) {
          AQIndex = AQ_INDEX.MODERATE;
        } else if (last.value >= 101 && last.value <= 360) {
          AQIndex = AQ_INDEX.UNHEALTHY_FOR_SENSITIVE;
        } else if (last.value >= 361 && last.value <= 649) {
          AQ_INDEX.UNHEALTHY;
        } else if (last.value >= 650 && last.value <= 1249) {
          AQIndex = AQ_INDEX.VERY_UNHEALTHY;
        } else {
          AQIndex = AQ_INDEX.HAZARDOUS;
        }
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
