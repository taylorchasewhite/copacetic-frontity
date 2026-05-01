/**
 * Hosts whose images are pre-declared in `next.config.mjs` `images.remotePatterns`.
 * Anything outside this list (or any non-https URL) should fall back to a
 * plain <img> so we never crash on legacy WordPress content that links to
 * arbitrary external image sources or to http:// URLs.
 */
export const ALLOWED_IMAGE_HOSTS = [
  "taylorchasewhite.com",
  "gravatar.com",
  "wp.com",
];

export function isAllowedImageHost(src: string): boolean {
  try {
    const u = new URL(src);
    if (u.protocol !== "https:") return false;
    const { hostname } = u;
    return ALLOWED_IMAGE_HOSTS.some(
      (h) => hostname === h || hostname.endsWith(`.${h}`)
    );
  } catch {
    return true; // relative / data URLs
  }
}
