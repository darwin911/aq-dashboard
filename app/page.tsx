import { AQIndexType } from "@/lib/types";
import clsx from "clsx";
import { getCountry } from "iso-3166-1-alpha-2";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
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

  const aqi = searchParams["aqi"] as AQIndexType;
  // const aqi: AQIndexType = "Moderate";

  function getAQIStyle() {
    const badgeColor = `bg-${aqi.toLowerCase().replace(/ (?! )/g, "-")}`;
    let textColor = "text-inherit";

    switch (aqi) {
      case "Hazardous":
      case "Very Unhealthy":
        textColor = "text-white";
    }

    return { badgeColor, textColor };
  }

  const { textColor, badgeColor } = getAQIStyle();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 tracking-tighter">
      <h1 className="text-4xl font-bold mb-5">Air Quality Dashboard</h1>
      <a href="/">Reset</a>

      <p>Latest Reading</p>
      <div
        className={clsx(
          badgeColor,
          "p-4 rounded-lg flex items-center justify-center border-black"
        )}
      >
        {aqi && <span className={clsx(textColor, "font-semibold")}>{aqi}</span>}
      </div>

      <div>
        <p>
          <strong>Latitude</strong>: {lat}
        </p>
        <p>
          <strong>Longitude</strong>: {lon}
        </p>
        {city && (
          <p>
            <strong>City</strong>: {city}
          </p>
        )}
        <p>
          <strong>Country</strong>: {country}
        </p>
        <p>
          <strong>IP</strong>: {ip}
        </p>
        {stationName && (
          <p>
            <strong>Station</strong>: {stationName}
          </p>
        )}
      </div>
    </main>
  );
}
