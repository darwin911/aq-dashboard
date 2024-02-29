import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";

async function searchAQI(formData: FormData) {
  "use server";
  const city = formData.get("city") as string;
  console.log({ city });

  if (!city) {
    throw new Error("City is required");
  }

  const citySearchURL = new URL(`/api/aq?city=${city}`, process.env.URL);

  console.debug(citySearchURL);

  const res = await fetch(citySearchURL);

  if (!res.ok) {
    throw new Error("Something went wrong when searching by zip");
  }

  const data = await res.json();
  console.log({ data });
}

export default function Search() {
  return (
    <form
      className="container max-w-lg py-2 w-full flex items-center gap-1 mb-4"
      action={searchAQI}
    >
      <Input type="search" placeholder="Enter a city" name="city" disabled />
      <Button type="submit" disabled>
        Find AQI
      </Button>
    </form>
  );
}
