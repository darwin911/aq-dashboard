import ClientGeoAQDAta from "@/app/_components/client-geo-aq-data";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log({ searchParams });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 tracking-tighter">
      <h1 className="text-4xl font-bold mb-5">Air Quality Dashboard</h1>
      <code>
        <pre>{JSON.stringify(searchParams, null, 4)}</pre>
      </code>
    </main>
  );
}
