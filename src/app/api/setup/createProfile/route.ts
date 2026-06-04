import { NextRequest, NextResponse } from "next/server";
import Profile from "@/app/lib/model/Profile";
import { connectDB } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    await connectDB();

    let profile = await Profile.findOne({ username });
    if (profile) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    profile = await Profile.create({ username });

    return NextResponse.json({
      message: "Profile created",
      profile: {
        username: profile.username,
        xp: profile.xp,
        level: profile.level,
        badges: profile.badges,
        nfts: profile.nfts,
        gold: profile.gold,
        gems: profile.gems,
      },
    });
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
