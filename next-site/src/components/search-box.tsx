"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export function SearchBox({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
      }}
      className="flex items-center gap-2 border-b-2 border-primary-300 focus-within:border-accent-500"
    >
      <FaSearch className="text-primary-500" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search posts…"
        autoFocus
        className="w-full bg-transparent py-3 text-lg text-primary-800 outline-none placeholder:text-primary-400"
      />
      <button
        type="submit"
        className="font-heading text-accent-500 hover:underline"
      >
        Go
      </button>
    </form>
  );
}
