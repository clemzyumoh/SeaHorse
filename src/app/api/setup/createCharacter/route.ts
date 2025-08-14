
import { NextResponse } from "next/server";
import { createCharacterIfNotExists } from "../../../lib/model/updateCharacter";

export async function POST(request: Request) {
  try {
    const { userPublicKey } = await request.json();
    if (!userPublicKey) {
      return NextResponse.json(
        { error: "Public key is required" },
        { status: 400 }
      );
    }

    const result = await createCharacterIfNotExists({ userPublicKey });
    return NextResponse.json(result || { characterAddress: null });
  } catch (error) {
    console.error("Error in createCharacter API:", error);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 }
    );
  }
}
