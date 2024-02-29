import Search from "@/app/_components/search";
import { AQIndexType } from "@/lib/types";
import clsx from "clsx";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log({ searchParams });
  const city = searchParams["city"];
  const loc = searchParams["loc"];
  const country = searchParams["country"];
  const ip = searchParams["ip"];
  const stationName = searchParams["stationName"];
  let lat, lon;

  if (typeof loc === "string") {
    [lat, lon] = loc.split(",");
  }

  const aqi = (searchParams["aqi"] as AQIndexType) ?? "N/A";
  // const aqi: AQIndexType = "Moderate";

  function getAQIStyle() {
    let textColor = "text-inherit";

    if (aqi === "N/A") {
      return { badgeColor: "bg-inherit", textColor };
    }

    const badgeColor = `bg-${aqi.toLowerCase().replace(/ (?! )/g, "-")}`;

    switch (aqi) {
      case "Hazardous":
      case "Very Unhealthy":
        textColor = "text-white";
    }

    return { badgeColor, textColor };
  }

  const { textColor, badgeColor } = getAQIStyle();

  return (
    <>
      <h1 className="text-2xl md:text-4xl font-bold mb-5">
        Air Quality Dashboard
      </h1>

      <Search />
      {aqi && aqi !== "N/A" ? (
        <>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-normal">AQI:</p>
            <span
              className={clsx(
                textColor,
                badgeColor,
                "font-semibold",
                "p-3 rounded-lg flex items-center justify-center"
              )}
            >
              {aqi}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <p>
                <strong>Latitude</strong>: {lat}
              </p>
              <p>
                <strong>Longitude</strong>: {lon}
              </p>
            </div>
            <div className="flex gap-0 items-center">
              {city && (
                <p className="flex-1">
                  <strong>City</strong>: {city}
                </p>
              )}
              <p className="flex-1">
                <strong>Country</strong>: {country}
              </p>
            </div>

            {stationName && (
              <p>
                <strong>Station</strong>: {stationName}
              </p>
            )}
          </div>
        </>
      ) : (
        <div>
          <p>
            Sorry, we were not able to find your location based on your IP. Try
            using browser location{" "}
            <Link
              href="/client"
              className="underline text-blue-800 font-semibold"
            >
              here
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
