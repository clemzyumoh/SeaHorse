
import { NextRequest, NextResponse } from "next/server";
import { updateCustomProfileData } from "../updateCustomdata/route";

export async function POST(req: NextRequest) {
  const { userPublicKey, username } = await req.json();

  const result = await updateCustomProfileData({ userPublicKey, username });

  return NextResponse.json(result);
}
