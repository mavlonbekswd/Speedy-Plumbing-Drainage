import PostcodeCheckClient from "@/components/PostcodeCheckClient";
import { COVERED_DISTRICTS, type TownRef } from "@/lib/coverage";
import { checkPostcode } from "@/lib/towns";

// Server wrapper. The checker runs in the browser, and importing lib/towns there would ship all
// 31 town leaves (notes, research sources and all) to every visitor. The browser needs one fact
// per district, the nearest published town, so that map is built here and passed down as a prop.
const TOWN_BY_DISTRICT: Readonly<Record<string, TownRef>> = Object.fromEntries(
  COVERED_DISTRICTS.flatMap((district) => {
    const town = checkPostcode(`${district} 1AA`).town;
    return town ? [[district, town] as const] : [];
  }),
);

export default function PostcodeCheck({ variant }: { variant?: "light" | "dark" }) {
  return <PostcodeCheckClient variant={variant} townByDistrict={TOWN_BY_DISTRICT} />;
}
