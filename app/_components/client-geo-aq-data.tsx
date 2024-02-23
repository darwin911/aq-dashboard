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
          const latitude = position.coords.latitude.toFixed(4);
          const longitude = position.coords.longitude.toFixed(4);
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
    <div>
      <p>Latitude: {coords?.lat}</p>
      <p>Longitude: {coords?.long}</p>
      <p>City: {(airQualityData && airQualityData["city"]) ?? "N/A"}</p>
      <p>Location: {(airQualityData && airQualityData["location"]) ?? "N/A"}</p>
      <p>Country: {(airQualityData && airQualityData["country"]) ?? "N/A"}</p>
      {airQualityData ? (
        <p>
          AQI: {airQualityData["value"]} {airQualityData["unit"]}
        </p>
      ) : null}
    </div>
  );
}
