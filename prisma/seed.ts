import "dotenv/config";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const dbFile = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbFile}` });
const db = new PrismaClient({ adapter });

async function main() {
  await db.providerVerification.deleteMany();
  await db.portfolioItem.deleteMany();
  await db.service.deleteMany();
  await db.availabilitySlot.deleteMany();
  await db.providerProfile.deleteMany();
  await db.user.deleteMany();

  // Admin
  await db.user.create({
    data: {
      role: "admin",
      phone: "+919999900001",
      name: "Demo Admin",
      preferredLang: "en",
      city: "Mumbai",
    },
  });

  // Provider 1 — Mehendi artist (already verified, for demo)
  const meera = await db.user.create({
    data: {
      role: "provider",
      phone: "+919811112222",
      name: "Meera Joshi",
      preferredLang: "hi",
      city: "Mumbai",
      provider: {
        create: {
          category: "mehendi",
          bio: "Bridal mehendi specialist. 6+ years, 200+ events across Mumbai & Pune. Traditional Rajasthani and Arabic styles.",
          languages: JSON.stringify(["hi", "gu", "en"]),
          serviceRadiusKm: 12,
          priceMin: 1500,
          priceMax: 8000,
          city: "Mumbai",
          area: "Powai",
          lat: 19.1176,
          lng: 72.906,
          upiId: "meera@upi",
          onboardingStatus: "verified",
          trustScore: 86,
          submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          services: {
            create: [
              {
                name: "Bridal mehendi",
                category: "mehendi",
                mode: "onsite",
                startingPrice: 5000,
                trialAvailable: true,
                trialPrice: 299,
                description: "Full hand & feet bridal design. 4-5 hr session.",
              },
              {
                name: "Guest mehendi",
                category: "mehendi",
                mode: "onsite",
                startingPrice: 1500,
                description: "Per-hand designs at events.",
              },
            ],
          },
          portfolio: {
            create: [
              { type: "image", mediaUrl: "https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?w=800", caption: "Bridal palms", verified: true },
              { type: "image", mediaUrl: "https://images.unsplash.com/photo-1583937443351-432d1ef0ec99?w=800", caption: "Arabic style", verified: true },
              { type: "image", mediaUrl: "https://images.unsplash.com/photo-1599360889420-da1afaba9edc?w=800", caption: "Detail work", verified: true },
            ],
          },
          verifications: {
            create: [
              { kind: "id", status: "approved", label: "Aadhaar", decidedAt: new Date() },
              { kind: "reference", status: "approved", label: "Reference: Priya Sharma (bride, Jan 2026)", decidedAt: new Date() },
              { kind: "social", status: "approved", label: "instagram.com/meera.mehendi", value: "https://instagram.com/meera.mehendi", decidedAt: new Date() },
              { kind: "portfolio", status: "approved", label: "3 verified portfolio images", decidedAt: new Date() },
            ],
          },
          availability: {
            create: [
              { weekday: 0, startTime: "09:00", endTime: "20:00" },
              { weekday: 6, startTime: "09:00", endTime: "20:00" },
              { weekday: 5, startTime: "17:00", endTime: "21:00" },
            ],
          },
        },
      },
    },
  });

  // Provider 2 — Home cook (submitted, pending verification — for admin queue demo)
  const lakshmi = await db.user.create({
    data: {
      role: "provider",
      phone: "+919833334444",
      name: "Lakshmi Iyer",
      preferredLang: "ta",
      city: "Mumbai",
      provider: {
        create: {
          category: "home_cook",
          bio: "South Indian home-style meals. Daily tiffin and small event catering (up to 30 guests).",
          languages: JSON.stringify(["ta", "en", "hi"]),
          serviceRadiusKm: 6,
          priceMin: 120,
          priceMax: 3500,
          city: "Mumbai",
          area: "Chembur",
          lat: 19.0628,
          lng: 72.9,
          upiId: "lakshmi.cook@upi",
          onboardingStatus: "submitted",
          trustScore: 0,
          submittedAt: new Date(),
          services: {
            create: [
              {
                name: "Daily veg tiffin",
                category: "home_cook",
                mode: "onsite",
                startingPrice: 120,
                trialAvailable: true,
                trialPrice: 99,
                description: "Rice, sambar, rasam, poriyal, curd. Daily delivery.",
              },
              {
                name: "Event catering (small)",
                category: "home_cook",
                mode: "onsite",
                startingPrice: 2500,
                description: "Up to 30 guests, Tam-Brahm menu.",
              },
            ],
          },
          portfolio: {
            create: [
              { type: "image", mediaUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800", caption: "South Indian thali" },
              { type: "menu", mediaUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800", caption: "Weekly menu" },
            ],
          },
          verifications: {
            create: [
              { kind: "id", status: "pending", label: "Aadhaar" },
              { kind: "reference", status: "pending", label: "Reference: Mrs. Kamath (tiffin customer, 8 months)" },
              { kind: "portfolio", status: "pending", label: "2 portfolio images" },
            ],
          },
          availability: {
            create: [
              { weekday: 1, startTime: "11:00", endTime: "14:00" },
              { weekday: 2, startTime: "11:00", endTime: "14:00" },
              { weekday: 3, startTime: "11:00", endTime: "14:00" },
              { weekday: 4, startTime: "11:00", endTime: "14:00" },
              { weekday: 5, startTime: "11:00", endTime: "14:00" },
            ],
          },
        },
      },
    },
  });

  // Provider 3 — Tutor (draft, just started)
  await db.user.create({
    data: {
      role: "provider",
      phone: "+919855556666",
      name: "Arjun Verma",
      preferredLang: "en",
      city: "Mumbai",
      provider: {
        create: {
          category: "tutor",
          bio: "IIT-Bombay alum. Math & Physics, classes 9-12, JEE prep.",
          languages: JSON.stringify(["en", "hi"]),
          serviceRadiusKm: 15,
          priceMin: 500,
          priceMax: 1500,
          city: "Mumbai",
          area: "Andheri",
          lat: 19.1197,
          lng: 72.847,
          onboardingStatus: "draft",
        },
      },
    },
  });

  console.log("✓ Seeded:", { meera: meera.id, lakshmi: lakshmi.id });
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
