import HeaderClient from "@/components/HeaderClient";
import { HEADER_LINKS, SERVICES_HUB_LINK, SERVICE_NAV_LINKS } from "@/lib/nav";

// Server wrapper. The nav list is generated from the content barrels; resolving it here and
// passing plain links down keeps the services, towns and media data out of the browser bundle.
// Only the burger and the Services drop-down need to run on the client.
//
// The drop-down is handed the hub link and the service list as plain {label, href} objects for
// the same reason the top nav is: HeaderClient must never import lib/services.
export default function Header() {
  const hub = SERVICES_HUB_LINK;

  return (
    <HeaderClient
      links={HEADER_LINKS}
      services={hub && SERVICE_NAV_LINKS.length > 0 ? { hub, items: SERVICE_NAV_LINKS } : null}
    />
  );
}
