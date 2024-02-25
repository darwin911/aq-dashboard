"use client";

import { useCallback, useEffect, useState } from "react";

export default function ClientGeoAQDAta() {
  const [coords, setCoords] = useState<null | { lat: string; long: string }>();
  const [airQualityData, setAirQualityData] = useState<null | any>(null);

  const getAQ = useCallback(
    async ({ lat, long }: { lat: string; long: string }) => {
      const aqRes = await fetch(`/api/aq/?lat=${lat}&long=${long}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!aqRes.ok) {
        throw new Error("Failed to fetch AQ Data");
      }

      const data = await aqRes.json();
      return data;
    },
    []
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          const latitude = position.coords.latitude.toFixed(3);
          const longitude = position.coords.longitude.toFixed(3);
          setCoords({ lat: latitude, long: longitude });

          const aqData = await getAQ({
            lat: latitude,
            long: longitude,
          });

          setAirQualityData(aqData);
        },
        function (error) {
          console.error("Error getting geolocation:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  }, [getAQ]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <p>
          <strong>Latitude</strong>: {coords?.lat}
        </p>
        <p>
          <strong>Longitude</strong>: {coords?.long}
        </p>
      </div>
      <p>
        <strong>City</strong>:{" "}
        {(airQualityData && airQualityData["city"]) ?? "N/A"}
      </p>
      <p>
        <strong>Location</strong>:{" "}
        {(airQualityData && airQualityData["location"]) ?? "N/A"}
      </p>
      <p>
        <strong>Country</strong>:{" "}
        {(airQualityData && airQualityData["country"]) ?? "N/A"}
      </p>
      {airQualityData ? (
        <section>
          <p>
            <strong>Air Quality Index</strong>: {airQualityData["aqIndex"]}
          </p>
          {airQualityData["ip"] ? (
            <p>
              <strong>IP: {airQualityData["ip"]}</strong>
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
