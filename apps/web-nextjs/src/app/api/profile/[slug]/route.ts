import { getProfile } from "@borta/user-pictures";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  try {
    const profile = await getProfile(slug);
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Profile not found or API error" }, { status: 404 });
  }
}
