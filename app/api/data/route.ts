import { NextResponse } from "next/server";
import { getPublicData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getPublicData();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
    }
  });
}
