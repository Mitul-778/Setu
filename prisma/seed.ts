import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  await db.providerVerificationStatus.deleteMany();
  await db.providerDocument.deleteMany();
  await db.portfolioItem.deleteMany();
  await db.uploadedFile.deleteMany();
  await db.availabilitySlot.deleteMany();
  await db.providerPackage.deleteMany();
  await db.providerService.deleteMany();
  await db.providerServiceSettings.deleteMany();
  await db.providerProfile.deleteMany();
  await db.user.deleteMany();

  await db.user.create({
    data: {
      role: "admin",
      phone: "+919999900001",
      name: "Demo Admin",
      preferredLang: "en",
      city: "Bangalore",
    },
  });

  const providerUser = await db.user.create({
    data: {
      role: "provider",
      phone: "+919811112222",
      name: "Arjun Singh",
      preferredLang: "hi",
      city: "Bangalore",
      providerProfile: {
        create: {
          displayName: "Arjun Singh",
          headline: "Verified Mehendi Artist",
          category: "mehendi",
          bio: "Bridal mehendi specialist with 5+ years of experience across Bangalore events.",
          translatedBio: "Bangalore events ke liye bridal mehendi specialist.",
          serviceIds: ["mehendi"],
          serviceNames: ["Bridal Mehendi", "Guest Mehendi", "Engagement Party Mehendi"],
          languages: ["Hindi", "English", "Kannada"],
          experienceLevel: "expert",
          yearsExperience: 5,
          city: "Bangalore",
          area: "Indiranagar",
          neighborhood: "100 Feet Road",
          serviceRadiusKm: 10,
          onboardingStatus: "submitted",
          submittedAt: new Date(),
          services: {
            create: [
              {
                categoryId: "mehendi",
                name: "Bridal Mehendi",
                description: "Traditional bridal mehendi for engagement and wedding events.",
              },
            ],
          },
          packages: {
            create: [
              {
                name: "Standard Package",
                description: "Bride plus simple guest designs.",
                priceInr: 3500,
                durationMin: 180,
              },
              {
                name: "Premium Package",
                description: "Detailed bridal design with guest support.",
                priceInr: 5000,
                durationMin: 300,
              },
            ],
          },
          settings: {
            create: {
              customQuoteEnabled: true,
              travelRadiusKm: 10,
              neighborhoods: ["Indiranagar", "Domlur", "Koramangala"],
              blackoutDates: [],
              weekendSurchargePct: 10,
              holidaySurchargePct: 15,
            },
          },
          availability: {
            create: [
              { weekday: 0, startTime: "09:00", endTime: "20:00" },
              { weekday: 5, startTime: "17:00", endTime: "21:00" },
              { weekday: 6, startTime: "09:00", endTime: "20:00" },
            ],
          },
          documents: {
            create: [
              {
                type: "profile_photo",
                label: "Profile Photo",
                status: "needs_fix",
                requiredFix: "Image is too blurry. Upload a clear, well-lit photo of your face.",
              },
              {
                type: "aadhaar_back",
                label: "Aadhaar Card Back",
                status: "needs_fix",
                requiredFix: "The back side of your Aadhaar card is missing.",
              },
            ],
          },
          verification: {
            create: {
              status: "needs_fix",
              expectedReviewHours: 48,
              submittedAt: new Date(),
              missingItems: [
                "Clear profile photo",
                "Aadhaar card back side",
              ],
            },
          },
        },
      },
    },
  });

  await db.user.create({
    data: {
      role: "customer",
      phone: "+919877776666",
      name: "Anita S.",
      preferredLang: "en",
      city: "Bangalore",
    },
  });

  console.log("Seeded Setu demo data", { providerUserId: providerUser.id });
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
