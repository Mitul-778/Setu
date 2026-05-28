export const CATEGORIES = [
  { id: "mehendi", label: "Mehendi Artist", emoji: "🌿", blurb: "Bridal & event mehendi" },
  { id: "home_cook", label: "Home Cook", emoji: "🍱", blurb: "Tiffins, meals & event orders" },
  { id: "tutor", label: "Tutor", emoji: "📚", blurb: "Academic & skill tutoring" },
  { id: "plumber", label: "Plumber", emoji: "🔧", blurb: "Repairs & installation" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
export function categoryEmoji(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.emoji ?? "•";
}

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "kn", name: "Kannada" },
  { code: "bn", name: "Bengali" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
  { code: "ur", name: "Urdu" },
] as const;

export function languageName(code: string) {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

export const CITIES = [
  "Mumbai",
  "Pune",
  "Bengaluru",
  "Hyderabad",
  "Delhi NCR",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
];
