import Link from "next/link";
import type { WPTerm } from "@/lib/wp-types";
import { localizeWpLink } from "@/lib/links";

interface PostCategoriesProps {
  categories: WPTerm[];
  limit?: number;
  className?: string;
}

export function PostCategories({
  categories,
  limit = 3,
  className = "",
}: PostCategoriesProps) {
  const items = categories.slice(0, limit);
  if (items.length === 0) return null;

  return (
    <div className={`mt-3 flex flex-wrap gap-2 ${className}`}>
      {items.map((cat) => (
        <Link
          key={cat.id}
          href={localizeWpLink(cat.link)}
          className="inline-block border-2 border-accent-400 px-2 py-0.5 font-heading font-medium text-primary-800 transition-colors hover:bg-accent-400 hover:text-white"
          dangerouslySetInnerHTML={{ __html: cat.name }}
        />
      ))}
    </div>
  );
}
