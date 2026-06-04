import { NextRequest, NextResponse } from "next/server";
import Profile from "@/app/lib/model/Profile";
import { connectDB } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    await connectDB();
    const profile = (await Profile.findOne({ username }).lean()) as any;
    if (!profile) {
      return NextResponse.json({ isOnboarded: false });
    }

    return NextResponse.json({
      isOnboarded: true,
      username: profile.username,
      xp: profile.xp,
      level: profile.level,
      badges: profile.badges,
      nfts: profile.nfts,
      gold: profile.gold,
      gems: profile.gems,
    });
  } catch (error) {
    console.error("Check profile error:", error);
    return NextResponse.json(
      { error: "Failed to check profile" },
      { status: 500 }
    );
  }
}
