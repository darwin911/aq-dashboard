const DEPLOY_URL = process.env.URL;

export const dynamic = "force-dynamic";
const API_URL = new URL("/api/ip", DEPLOY_URL);

async function fetchIPData() {
  console.log({ API_URL });
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      console.log({ data });

      if (data) {
        return data;
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export default async function IpPage() {
  const ipData = await fetchIPData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>AQ Data</div>
      <code>
        <pre>{JSON.stringify(ipData, null, 4)}</pre>
      </code>
    </main>
  );
}
