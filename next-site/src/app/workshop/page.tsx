import type { Metadata } from "next";
import Link from "next/link";
import { FaGithub, FaStar, FaCodeBranch, FaCircle } from "react-icons/fa";
import { Collapse } from "@/components/collapse";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/wp";

export const revalidate = 600; // 10 min

const GH_USER = "taylorchasewhite";
const GH = "https://api.github.com";

const PROJECT_CATEGORY_ID = 12;

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

interface UserInfo {
  login: string;
  name: string | null;
  bio: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
}

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${GH}${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "taylorchasewhite-site",
      },
      next: { revalidate },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Workshop",
  description: "Repositories I'm actively building, plus writing about projects, code, and the craft of making things.",
};

export default async function WorkshopPage() {
  const [user, repos, projectPosts] = await Promise.all([
    gh<UserInfo>(`/users/${GH_USER}`),
    gh<Repo[]>(`/users/${GH_USER}/repos?sort=pushed&per_page=50&type=owner`),
    getPosts({ category: PROJECT_CATEGORY_ID, perPage: 5 }).catch(() => null),
  ]);

  const visibleRepos = (repos ?? [])
    .filter((r) => !r.fork && !r.archived)
    .sort(
      (a, b) =>
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    );

  const posts = projectPosts?.items ?? [];

  return (
    <div className="mx-auto w-[92%] max-w-content py-10">
      <header className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <FaGithub className="h-12 w-12 text-primary-700" aria-hidden />
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary-800">
            Workshop
          </h1>
          <p className="mt-1 text-sm text-primary-500">
            Things I'm building &mdash; in code and in writing.
          </p>
          {user ? (
            <p className="mt-1 text-primary-600">
              {user.public_repos} public repos &middot; {user.followers} followers &middot;{" "}
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent-600 hover:underline"
              >
                @{user.login}
              </a>
            </p>
          ) : (
            <p className="mt-1 text-primary-600">
              GitHub data is temporarily unavailable.
            </p>
          )}
        </div>
      </header>

      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold text-primary-800">
          Recently active repositories
        </h2>
        {visibleRepos.length === 0 ? (
          <p className="text-primary-600">No public repositories to show.</p>
        ) : (
          <Collapse initial={5}>
            {visibleRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </Collapse>
        )}
      </section>

      {posts.length > 0 && (
        <section className="mt-16">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="font-heading text-xl font-semibold text-primary-800">
              From the blog
            </h2>
            <Link
              href="/category/project"
              className="text-sm font-heading text-accent-600 hover:underline"
            >
              All project posts &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-12 text-sm text-primary-500">
        See everything on{" "}
        <a
          href={`https://github.com/${GH_USER}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-accent-600 hover:underline"
        >
          github.com/{GH_USER}
        </a>
        .
      </p>
    </div>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex flex-col rounded-md border border-primary-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-md"
    >
      <h3 className="font-heading text-lg font-semibold text-primary-800 group-hover:text-accent-600">
        {repo.name}
      </h3>
      {repo.description && (
        <p className="mt-2 line-clamp-3 text-sm text-primary-600">
          {repo.description}
        </p>
      )}
      <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-primary-500">
        {repo.language && (
          <span className="inline-flex items-center gap-1">
            <FaCircle className="h-2 w-2 text-accent-500" aria-hidden />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <FaStar className="h-3 w-3" aria-hidden />
          {repo.stargazers_count}
        </span>
        <span className="inline-flex items-center gap-1">
          <FaCodeBranch className="h-3 w-3" aria-hidden />
          {repo.forks_count}
        </span>
        <span className="ml-auto">
          {new Date(repo.pushed_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </a>
  );
}
