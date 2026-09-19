import {
  Bathtub,
  CalendarCheck,
  Camera,
  ClipboardText,
  Clock,
  Drop,
  Fire,
  Phone,
  ShieldCheck,
  Toilet,
  WhatsappLogo,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { IconKey } from "@/lib/types";

// Data files name icons by key so they never import React. The SSR entry point keeps Phosphor
// out of the client bundle for server components.
export const ICONS: Record<IconKey, Icon> = {
  phone: Phone,
  clipboard: ClipboardText,
  wrench: Wrench,
  drop: Drop,
  camera: Camera,
  calendar: CalendarCheck,
  shield: ShieldCheck,
  clock: Clock,
  toilet: Toilet,
  bath: Bathtub,
  flame: Fire,
  whatsapp: WhatsappLogo,
};

export function ContentIcon({ name, size = 20, className }: { name: IconKey; size?: number; className?: string }) {
  const Glyph = ICONS[name];
  return <Glyph size={size} weight="fill" aria-hidden className={className} />;
}
