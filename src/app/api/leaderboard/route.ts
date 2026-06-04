import { NextResponse } from "next/server";
import Profile from "@/app/lib/model/Profile";
import { connectDB } from "@/app/lib/db";

export async function GET() {
  try {
    await connectDB();
    const profiles = await Profile.find().sort({ xp: -1 }).lean();
    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
