// Minimal subset of WP REST API response shapes we actually use.
// Extend as needed when porting more components.

export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPMediaSize {
  source_url: string;
  width: number;
  height: number;
  mime_type: string;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes: Record<string, WPMediaSize>;
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  link: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  description: string;
  link: string;
  avatar_urls: Record<string, string>;
}

export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  status: string;
  type: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: WPAuthor[];
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
}

export interface WPPage extends WPPost {}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}
