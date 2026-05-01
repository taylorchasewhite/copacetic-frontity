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
} from "react-icons/fa";

export interface MenuItem {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

export const siteConfig = {
  title: "Taylor Chase White",
  description: "Personal blog of Taylor Chase White.",
  logo: "Taylor Chase White",
  menu: [
    { label: "Home", href: "/", icon: FaHome },
    { label: "Blog", href: "/category/blog", icon: FaPenNib },
    { label: "Features", href: "/category/features", icon: FaStar },
    { label: "Philosophy", href: "/category/philosophy", icon: FaBookOpen },
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
