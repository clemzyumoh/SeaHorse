// lib/getHoneycombToken.ts
import Token from "../lib/model/Token";
import mongoose from "mongoose";


async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: "SeaHorse",
    });
    console.log("MongoDB connected");
  }
}


export async function getHoneycombToken() {
  await connectDB();

  const latestToken = await Token.findOne().sort({ createdAt: -1 });

  if (!latestToken) {
    console.log("[Honeycomb] No token found, calling createAuth...");

    // Call your Next.js API route to generate the token
   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
   const res = await fetch(`${baseUrl}/api/setup/createAuth`, {
     method: "POST",
   });


    if (!res.ok) {
      throw new Error(`[Honeycomb] Failed to create token: ${res.statusText}`);
    }

    const data = await res.json();
    return data.accessToken;
  }

  return latestToken.value;
}
