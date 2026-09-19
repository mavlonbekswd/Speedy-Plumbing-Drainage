import HeaderClient from "@/components/HeaderClient";
import { HEADER_LINKS } from "@/lib/nav";

// Server wrapper. The nav list is generated from the content barrels; resolving it here and
// passing plain links down keeps the services, towns and media data out of the browser bundle.
// Only the burger behaviour in HeaderClient needs to run on the client.
export default function Header() {
  return <HeaderClient links={HEADER_LINKS} />;
}
