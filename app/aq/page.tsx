const VERCEL_URL = process.env.VERCEL_URL;

export default async function IpPage() {
  const res = await fetch(new URL("/api/ip", VERCEL_URL));
  let ipData;
  if (res.ok) {
    const data = await res.json();
    console.log({ data });
    if (data) {
      ipData = data;
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>AQ Data</div>
      <code>
        <pre>{JSON.stringify(ipData, null, 4)}</pre>
      </code>
    </main>
  );
}
