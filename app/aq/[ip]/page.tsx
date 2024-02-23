export default function IpPage({ params }: { params: { ip: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        IP: <span>{decodeURIComponent(params.ip)}</span>
      </div>
    </main>
  );
}
