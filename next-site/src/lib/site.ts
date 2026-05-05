// Site-wide configuration. Mirrors what frontity.settings.js used to hold.

import type { ComponentType } from "react";
import {
  FaHome,
  FaPenNib,
  FaStar,
  FaBookOpen,
  FaProjectDiagram,
  FaTools,
  FaUser,
  FaLandmark,
} from "react-icons/fa";

export interface MenuItem {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

/**
 * Category slugs whose posts are part of the OurGov body of work. They
 * are excluded from the home/blog feed and surfaced through a dedicated
 * `/ourgov` aggregator page so the OurGov material stays grouped.
 */
export const OURGOV_CATEGORY_SLUGS = ["features", "announcements"] as const;

export const siteConfig = {
  title: "Taylor Chase White",
  description: "Personal blog of Taylor Chase White.",
  logo: "Taylor Chase White",
  menu: [
    { label: "Home", href: "/", icon: FaHome },
    { label: "Blog", href: "/category/blog", icon: FaPenNib },
    { label: "Philosophy", href: "/category/philosophy", icon: FaBookOpen },
    { label: "OurGov", href: "/ourgov", icon: FaLandmark },
    { label: "Projects", href: "/projects", icon: FaProjectDiagram },
    { label: "Workshop", href: "/workshop", icon: FaTools },
    { label: "About", href: "/about", icon: FaUser },
  ] as MenuItem[],
  socialLinks: [
    ["github", "https://github.com/taylorchasewhite"],
    ["youtube", "https://www.youtube.com/@tdog1million"],
    ["facebook", "https://www.facebook.com/taylorchasewhite/"],
    ["twitter", "https://twitter.com/taychasewhite/"],
    ["linkedin", "https://www.linkedin.com/in/taylorchasewhite/"],
    ["instagram", "https://www.instagram.com/taylorchasewhite/"],
  ] as Array<[string, string]>,
};
