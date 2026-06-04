import { NextResponse } from "next/server";
import Profile from "@/app/lib/model/Profile";
import { connectDB } from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    await connectDB();
    const profile = await Profile.findOne({ username });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    profile.gold += 50;
    profile.gems += 5;
    await profile.save();

    return NextResponse.json({ success: true, message: "Daily reward claimed", gold: profile.gold, gems: profile.gems });
  } catch (error) {
    console.error("Funding error:", error);
    return NextResponse.json({ error: "Failed to claim reward" }, { status: 500 });
  }
}
