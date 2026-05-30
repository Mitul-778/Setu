import {
  Brush,
  Camera,
  ChefHat,
  GraduationCap,
  PlugZap,
  WandSparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Single source of truth for the services offered on Setu.
// Used everywhere: customer interests, provider onboarding, profile pages, APIs.
export type ServiceId =
  | "mehendi"
  | "chef"
  | "makeup"
  | "photo"
  | "electrician"
  | "tutor"
  | "plumber";

export type ServiceOption = {
  id: ServiceId;
  label: string;
  icon: LucideIcon;
};

export const SERVICES: ServiceOption[] = [
  { id: "mehendi", label: "Mehendi Artist", icon: Brush },
  { id: "chef", label: "Cook/Chef", icon: ChefHat },
  { id: "makeup", label: "Makeup Artist", icon: WandSparkles },
  { id: "photo", label: "Photographer", icon: Camera },
  { id: "electrician", label: "Electrician", icon: PlugZap },
  { id: "tutor", label: "Tutor", icon: GraduationCap },
  { id: "plumber", label: "Plumber", icon: Wrench }
];

export const SERVICE_IDS: ServiceId[] = SERVICES.map((service) => service.id);

export function isServiceId(value: string): value is ServiceId {
  return SERVICE_IDS.includes(value as ServiceId);
}

export function serviceLabel(id: string): string {
  return SERVICES.find((service) => service.id === id)?.label ?? id;
}

export function serviceIcon(id: string): LucideIcon | undefined {
  return SERVICES.find((service) => service.id === id)?.icon;
}
