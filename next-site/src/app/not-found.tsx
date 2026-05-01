import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-[92%] max-w-content py-20 text-center">
      <h1 className="font-heading text-5xl font-bold text-primary-800">404</h1>
      <p className="mt-4 text-primary-600">
        That page doesn&apos;t exist (yet).
      </p>
      <Link
        href="/"
        className="mt-8 inline-block font-heading text-accent-500 hover:underline"
      >
        ← Back home
      </Link>
    </div>
  );
}
