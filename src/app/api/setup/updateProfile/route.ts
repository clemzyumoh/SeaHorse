import { NextRequest, NextResponse } from "next/server";
import Profile from "@/app/lib/model/Profile";
import { connectDB } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const {
      username,
      xp,
      level,
      badgeUrl,
      nftAddress,
      gold,
      gems,
    } = await req.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const profile = await Profile.findOne({ username });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (typeof xp === "number") {
      profile.xp += xp;
    } else if (typeof xp === "string" && xp.trim() !== "") {
      profile.xp += parseInt(xp, 10) || 0;
    }

    if (level && typeof level === "string") {
      profile.level = level;
    }

    if (badgeUrl && typeof badgeUrl === "string") {
      if (!profile.badges.includes(badgeUrl)) {
        profile.badges.push(badgeUrl);
      }
    }

    if (nftAddress && typeof nftAddress === "string") {
      if (!profile.nfts.includes(nftAddress)) {
        profile.nfts.push(nftAddress);
      }
    }

    if (typeof gold === "number") {
      profile.gold += gold;
    } else if (typeof gold === "string" && gold.trim() !== "") {
      profile.gold += parseInt(gold, 10) || 0;
    }

    if (typeof gems === "number") {
      profile.gems += gems;
    } else if (typeof gems === "string" && gems.trim() !== "") {
      profile.gems += parseInt(gems, 10) || 0;
    }

    await profile.save();

    return NextResponse.json({
      message: "Profile updated",
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
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
