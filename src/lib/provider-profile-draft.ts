import { SERVICES, serviceLabel, type ServiceId } from "@/lib/services";

export type ProviderServiceId = ServiceId;

export type ProviderExperienceId = "beginner" | "1-3" | "3-5" | "5-plus";

export type PricingGuidance = {
  label: string;
  range: string;
};

export type ProviderProfileDraft = {
  serviceIds: ProviderServiceId[];
  languages: string[];
  experienceLevel: ProviderExperienceId;
  bio: string;
  translatedBio: string;
  serviceNames: string[];
  pricingGuidance: PricingGuidance[];
  startingPrice: string;
};

// Per-service onboarding metadata, keyed by the canonical service id from
// "@/lib/services". Labels and icons live in the shared SERVICES list; this
// only adds the provider-onboarding extras (suggested names + pricing).
const serviceMeta: Record<
  ProviderServiceId,
  { serviceNames: string[]; pricingGuidance: PricingGuidance[]; startingPrice: string }
> = {
  mehendi: {
    serviceNames: ["Basic Bridal Mehendi", "Engagement Mehendi", "Party Mehendi"],
    pricingGuidance: [
      { label: "Basic party mehendi", range: "\u20B9799 - \u20B91,200" },
      { label: "Engagement booking", range: "\u20B91,500 - \u20B92,500" },
      { label: "Bridal package", range: "\u20B92,000 - \u20B93,500" },
    ],
    startingPrice: "2,000",
  },
  chef: {
    serviceNames: ["Daily Home Meals", "Party Snacks", "Weekly Tiffin"],
    pricingGuidance: [
      { label: "Single home meal", range: "\u20B9250 - \u20B9400" },
      { label: "Weekly tiffin plan", range: "\u20B91,200 - \u20B92,000" },
      { label: "Small event cooking", range: "\u20B93,000 - \u20B96,000" },
    ],
    startingPrice: "299",
  },
  makeup: {
    serviceNames: ["Party Makeup", "Engagement Makeup", "Bridal Trial"],
    pricingGuidance: [
      { label: "Party makeup", range: "\u20B91,499 - \u20B92,500" },
      { label: "Engagement look", range: "\u20B93,000 - \u20B95,500" },
      { label: "Bridal makeup", range: "\u20B96,000 - \u20B912,000" },
    ],
    startingPrice: "1,499",
  },
  photo: {
    serviceNames: ["Event Photography", "Portrait Shoot", "Product Photos"],
    pricingGuidance: [
      { label: "Portrait session", range: "\u20B91,000 - \u20B92,000" },
      { label: "Small event", range: "\u20B93,500 - \u20B97,000" },
      { label: "Half-day coverage", range: "\u20B98,000 - \u20B915,000" },
    ],
    startingPrice: "1,000",
  },
  electrician: {
    serviceNames: ["Switch Repair", "Fan Installation", "Emergency Visit"],
    pricingGuidance: [
      { label: "Inspection visit", range: "\u20B9299 - \u20B9499" },
      { label: "Fan installation", range: "\u20B9400 - \u20B9800" },
      { label: "Emergency visit", range: "\u20B9700 - \u20B91,200" },
    ],
    startingPrice: "299",
  },
  tutor: {
    serviceNames: ["Math Tutor", "English Speaking", "Homework Support"],
    pricingGuidance: [
      { label: "Single class", range: "\u20B9400 - \u20B9800" },
      { label: "Weekly classes", range: "\u20B92,000 - \u20B94,500" },
      { label: "Exam prep plan", range: "\u20B95,000 - \u20B99,000" },
    ],
    startingPrice: "500",
  },
  plumber: {
    serviceNames: ["Tap & Faucet Repair", "Pipe Fitting", "Leak Fix"],
    pricingGuidance: [
      { label: "Inspection visit", range: "\u20B9199 - \u20B9399" },
      { label: "Tap or pipe repair", range: "\u20B9400 - \u20B9900" },
      { label: "Bathroom fitting", range: "\u20B91,500 - \u20B94,000" },
    ],
    startingPrice: "299",
  },
};

export const providerServiceOptions = SERVICES.map((service) => ({
  id: service.id,
  label: service.label,
  serviceNames: serviceMeta[service.id].serviceNames,
  pricingGuidance: serviceMeta[service.id].pricingGuidance,
  startingPrice: serviceMeta[service.id].startingPrice,
}));

export const providerLanguageOptions = [
  "English",
  "Hindi",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
];

export const providerExperienceLevels = [
  {
    id: "beginner",
    title: "Beginner",
    copy: "New to paid service work, ready to start.",
    bioText: "new professional experience",
  },
  {
    id: "1-3",
    title: "1-3 Years",
    copy: "Some professional experience.",
    bioText: "1-3 years of experience",
  },
  {
    id: "3-5",
    title: "3-5 Years",
    copy: "Experienced professional.",
    bioText: "3-5 years of experience",
  },
  {
    id: "5-plus",
    title: "5+ Years",
    copy: "Highly experienced provider.",
    bioText: "5+ years of experience",
  },
] satisfies Array<{
  id: ProviderExperienceId;
  title: string;
  copy: string;
  bioText: string;
}>;

export const defaultProviderProfileDraft = createProviderProfileDraft({
  serviceIds: ["chef"],
  languages: ["English", "Hindi"],
  experienceLevel: "1-3",
});

export function createProviderProfileDraft(
  input: Partial<ProviderProfileDraft> = {}
): ProviderProfileDraft {
  const serviceIds = normalizeServiceIds(input.serviceIds);
  const languages = normalizeLanguages(input.languages);
  const experienceLevel = normalizeExperience(input.experienceLevel);
  const derivedServiceNames = deriveServiceNames(serviceIds);
  const pricingGuidance = derivePricingGuidance(serviceIds);
  const startingPrice = getPrimaryService(serviceIds).startingPrice;

  const base: ProviderProfileDraft = {
    serviceIds,
    languages,
    experienceLevel,
    bio: "",
    translatedBio: "",
    serviceNames: derivedServiceNames,
    pricingGuidance,
    startingPrice,
  };

  return {
    ...base,
    ...input,
    serviceIds,
    languages,
    experienceLevel,
    serviceNames: input.serviceNames?.length ? input.serviceNames : derivedServiceNames,
    pricingGuidance: input.pricingGuidance?.length ? input.pricingGuidance : pricingGuidance,
    startingPrice: input.startingPrice || startingPrice,
    bio: input.bio || buildGeneratedBio(base),
    translatedBio: input.translatedBio || buildTranslatedBio(base),
  };
}

export function createStructuredProviderProfileDraft(
  input: Pick<ProviderProfileDraft, "serviceIds" | "languages" | "experienceLevel">
): ProviderProfileDraft {
  return createProviderProfileDraft(input);
}

export function getServiceLabels(serviceIds: ProviderServiceId[]) {
  return normalizeServiceIds(serviceIds).map((id) => serviceLabel(id));
}

export function getExperienceLabel(experienceLevel: ProviderExperienceId) {
  return getExperienceOption(experienceLevel).title;
}

export function getTranslationLanguage(languages: string[]) {
  return languages.find((language) => language !== "English") || "Hindi";
}

function normalizeServiceIds(serviceIds?: string[]) {
  const validIds = providerServiceOptions.map((service) => service.id);
  const normalized = (serviceIds || [])
    .filter((id): id is ProviderServiceId => validIds.includes(id as ProviderServiceId))
    .filter((id, index, array) => array.indexOf(id) === index);

  return normalized.length ? normalized : (["chef"] as ProviderServiceId[]);
}

function normalizeLanguages(languages?: string[]) {
  const normalized = (languages || [])
    .filter((language) => providerLanguageOptions.includes(language))
    .filter((language, index, array) => array.indexOf(language) === index);

  return normalized.length ? normalized : ["English", "Hindi"];
}

function normalizeExperience(experienceLevel?: string) {
  return providerExperienceLevels.some((level) => level.id === experienceLevel)
    ? (experienceLevel as ProviderExperienceId)
    : "1-3";
}

function getPrimaryService(serviceIds: ProviderServiceId[]) {
  return getServiceOption(serviceIds[0] || "chef");
}

function getServiceOption(serviceId: ProviderServiceId) {
  return (
    providerServiceOptions.find((service) => service.id === serviceId) ||
    providerServiceOptions[0]
  );
}

function getExperienceOption(experienceLevel: ProviderExperienceId) {
  return (
    providerExperienceLevels.find((level) => level.id === experienceLevel) ||
    providerExperienceLevels[1]
  );
}

function deriveServiceNames(serviceIds: ProviderServiceId[]) {
  return serviceIds
    .flatMap((id) => getServiceOption(id).serviceNames)
    .filter((name, index, array) => array.indexOf(name) === index)
    .slice(0, 5);
}

function derivePricingGuidance(serviceIds: ProviderServiceId[]) {
  return serviceIds
    .flatMap((id) => getServiceOption(id).pricingGuidance)
    .filter((item, index, array) =>
      array.findIndex((candidate) => candidate.label === item.label) === index
    )
    .slice(0, 4);
}

function buildGeneratedBio(draft: Pick<ProviderProfileDraft, "serviceIds" | "languages" | "experienceLevel">) {
  const labels = getServiceLabels(draft.serviceIds);
  const primary = labels[0].toLowerCase();
  const allServices = joinList(labels.map((label) => label.toLowerCase()));
  const experience = getExperienceOption(draft.experienceLevel).bioText;
  const spokenLanguages = joinList(draft.languages);

  return `I am a ${primary} in Bangalore with ${experience}. I offer ${allServices} services with clear pricing, on-time arrival, and comfortable communication in ${spokenLanguages}.`;
}

function buildTranslatedBio(draft: Pick<ProviderProfileDraft, "serviceIds" | "languages" | "experienceLevel">) {
  const primary = getServiceLabels(draft.serviceIds)[0];
  const experience = getExperienceOption(draft.experienceLevel).title;

  if (getTranslationLanguage(draft.languages) === "Hindi") {
    return `\u092E\u0948\u0902 Bangalore \u092E\u0947\u0902 ${experience} \u0905\u0928\u0941\u092D\u0935 \u0935\u093E\u0932\u093E ${primary} \u0939\u0942\u0902\u0964 \u092E\u0948\u0902 \u0938\u093E\u092B \u0915\u093E\u092E, \u0938\u092E\u092F \u092A\u0930 \u092A\u0939\u0941\u0902\u091A\u0928\u0947 \u0914\u0930 \u092D\u0930\u094B\u0938\u0947\u092E\u0902\u0926 \u0938\u0947\u0935\u093E \u092A\u0930 \u0927\u094D\u092F\u093E\u0928 \u0926\u0947\u0924\u093E \u0939\u0942\u0902\u0964`;
  }

  return `Local language profile draft for ${primary}: clear work, on-time arrival, and trusted service for customers in Bangalore.`;
}

function joinList(items: string[]) {
  if (items.length <= 1) {
    return items[0] || "local service";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
