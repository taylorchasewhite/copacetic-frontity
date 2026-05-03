import Link from "next/link";
import { siteConfig } from "@/lib/site";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  youtube: FaYoutube,
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
};

export function Footer() {
  return (
    <footer className="py-4 text-sm text-primary-500 md:ml-[220px]">
      <div className="mx-auto flex w-[92%] max-w-content flex-col gap-4">
        {/* Vintage-only site map: the modern UI uses the left rail, but
            vintage mode hides it, so list the pages here in classic
            footer-nav style. Hidden in modern mode via globals.css. */}
        <nav data-vintage-footer-nav className="hidden text-center">
          {siteConfig.menu
            .filter((item) => item.href !== "/")
            .map((item, i) => (
              <span key={item.href}>
                {i > 0 && <span aria-hidden> | </span>}
                <Link href={item.href}>{item.label}</Link>
              </span>
            ))}
        </nav>

        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <span>© {new Date().getFullYear()} Taylor Chase White</span>
          <div className="flex items-center gap-4">
            {siteConfig.socialLinks.map(([name, url]) => {
              const Icon = ICONS[name];
              if (!Icon) return null;
              return (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={name}
                  data-footer-icon
                  className="text-primary-400 transition-colors hover:text-accent-500"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
