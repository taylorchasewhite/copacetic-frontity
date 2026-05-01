import Image from "next/image";
import Link from "next/link";
import type { WPAuthor } from "@/lib/wp-types";
import { localizeWpLink } from "@/lib/links";

export function AuthorBio({ author }: { author: WPAuthor }) {
  const avatar = author.avatar_urls?.["96"];
  return (
    <div className="flex items-start gap-5 rounded-lg bg-primary-50 p-6">
      {avatar && (
        <Image
          src={avatar}
          alt={author.name}
          width={72}
          height={72}
          className="h-18 w-18 flex-shrink-0 rounded-full"
        />
      )}
      <div>
        <Link
          href={localizeWpLink(author.link)}
          className="font-heading text-lg font-bold text-primary-800 hover:text-accent-500"
        >
          {author.name}
        </Link>
        {author.description && (
          <p className="mt-1 text-primary-700">{author.description}</p>
        )}
      </div>
    </div>
  );
}
