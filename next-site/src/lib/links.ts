// WP returns absolute links pointing at the WP install. Rewrite them so
// internal links stay on this site.

const WP_HOSTS = new Set([
  "old.taylorchasewhite.com",
  "taylorchasewhite.com",
  "www.taylorchasewhite.com",
]);

export function localizeWpLink(link: string): string {
  try {
    const u = new URL(link);
    if (WP_HOSTS.has(u.hostname)) {
      return u.pathname + u.search + u.hash;
    }
    return link;
  } catch {
    return link;
  }
}
