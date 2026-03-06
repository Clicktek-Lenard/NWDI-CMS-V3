import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <span className="text-4xl font-bold text-slate-400">404</span>
      </div>
      <h1 className="mb-2 text-xl font-semibold text-slate-800">Page not found</h1>
      <p className="mb-6 text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/queue"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to Queue
      </Link>
    </div>
  );
}
