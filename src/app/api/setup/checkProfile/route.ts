
import { NextRequest, NextResponse } from "next/server";
import createEdgeClient from "@honeycomb-protocol/edge-client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicKey = searchParams.get("publicKey");

    if (!publicKey) {
      return NextResponse.json(
        { error: "Public key required" },
        { status: 400 }
      );
    }

    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com",
      true
    );
    const profiles = await client
      .findProfiles({
        identities: [publicKey],
        includeProof: true,
      })
      .then(({ profile }) => profile);

    if (profiles.length > 0) {
      return NextResponse.json({
        isOnboarded: true,
        username: profiles[0].info.name,
      });
    }

    return NextResponse.json({ isOnboarded: false });
  } catch (error) {
    console.error("Check profile error:", error);
    return NextResponse.json(
      { error: "Failed to check profile" },
      { status: 500 }
    );
  }
}