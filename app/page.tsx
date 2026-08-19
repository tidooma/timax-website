import { SiteShell } from "@/components/SiteShell";
import { getPublicData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPublicData();

  return <SiteShell data={data} />;
}
