import { NextResponse } from "next/server";

import { NextRequest } from "next/server";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";

type MeasurementsResponse = {
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

export async function GET(request: NextRequest) {
  unstable_noStore();
  console.log("\n** GET /aq Running **\n");

  const params = new URL(request.url).searchParams;
  const lat = params.get("lat");
  const long = params.get("long");

  const baseUrl = "https://api.openaq.org/v2";

  const airQualityUrl = `${baseUrl}/measurements?&limit=10&page=1&offset=0&sort=desc&coordinates=${lat}%2C${long}&radius=25000&order_by=datetime`;

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

    if (data.results.length) {
      const latestMeasurement = data.results[0];

      const locationId = latestMeasurement.locationId;
      console.log("\n", { locationId }, "\n");
      if (locationId) {
        console.debug(`\nhttps://api.openaq.org/v2/locations/${locationId}\n`);
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

          console.debug("Location Data: ", locationData);

          const cityLocation = locationData.results[0].city;

          return NextResponse.json({
            ...latestMeasurement,
            city: cityLocation ?? "N/A",
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
