import ClientGeoAQDAta from "@/app/_components/client-geo-aq-data";

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1>Air Quality Dashboard</h1>
      <ClientGeoAQDAta />
    </main>
  );
}
