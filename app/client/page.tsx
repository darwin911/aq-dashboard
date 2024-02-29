import ClientGeoAQDAta from "@/app/_components/client-geo-aq-data";
import Link from "next/link";

export default function ClientAQI() {
  return (
    <>
      <h1 className="text-2xl md:text-4xl font-bold mb-5">
        Air Quality Dashboard
      </h1>
      <div className="container">
        <Link href="/" className="underline">
          Back
        </Link>
      </div>
      <ClientGeoAQDAta />
    </>
  );
}
