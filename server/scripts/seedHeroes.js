import mongoose from "mongoose";
import dotenv from "dotenv";
import Hero from "../models/Hero.js";

// Load environment variables
dotenv.config();

const heroes = [
  { name: "Flash", speedFactor: 0.3 },
  { name: "Spider-Man", speedFactor: 0.5 },
  { name: "Batman", speedFactor: 0.7 },
  { name: "Aquaman", speedFactor: 0.6 },
  { name: "Ant-Man", speedFactor: 0.4 },
  { name: "Doctor Strange", speedFactor: 0.2 },
  { name: "Wonder Woman", speedFactor: 0.5 },
];

async function seedHeroes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing heroes
    await Hero.deleteMany({});
    console.log("Cleared existing heroes");

    // Insert new heroes
    const insertedHeroes = await Hero.insertMany(heroes);
    console.log(`Inserted ${insertedHeroes.length} heroes:`);
    insertedHeroes.forEach((hero) => {
      console.log(`  - ${hero.name} (speedFactor: ${hero.speedFactor})`);
    });

    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedHeroes();
