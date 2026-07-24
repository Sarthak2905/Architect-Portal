/**
 * Run once with: npm run seed:owner
 * Creates the single owner account from SEED_OWNER_USERNAME / SEED_OWNER_PASSWORD
 * in .env. Safe to re-run — it will skip if an owner already exists rather
 * than overwrite one, so you don't accidentally reset a password you already
 * changed from the app.
 */
import { env } from "../config/env.js";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";

const run = async () => {
  await connectDB();

  const existing = await User.findOne({ role: "owner" });
  if (existing) {
    console.log(
      `Owner account already exists (username: ${existing.username}). Nothing to do.`
    );
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await User.hashPassword(env.seedOwner.password);
  const owner = await User.create({
    username: env.seedOwner.username.toLowerCase(),
    passwordHash,
    role: "owner",
  });

  console.log(`Owner account created: ${owner.username}`);
  console.log(
    "Log in with this username and the password from your .env, then change it via PATCH /api/auth/credentials."
  );
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
