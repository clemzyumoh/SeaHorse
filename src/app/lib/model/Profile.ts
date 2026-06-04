import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
    level: { type: String, default: "level1" },
    badges: { type: [String], default: [] },
    nfts: { type: [String], default: [] },
    completedMissions: { type: [String], default: [] },
    gold: { type: Number, default: 0 },
    gems: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

profileSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);
export default Profile;
