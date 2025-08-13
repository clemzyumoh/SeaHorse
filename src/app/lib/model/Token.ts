// models/Token.ts
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  value: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // expires after 24 hours
  },
});

export default mongoose.models.Token || mongoose.model("Token", tokenSchema);
