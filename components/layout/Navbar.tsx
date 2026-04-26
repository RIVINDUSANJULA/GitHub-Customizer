import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img src="/LOGO.png" alt="GitInfo Logo" className="h-6 w-6 object-contain" />
          <span className="font-semibold tracking-tight text-lg">GitInfo</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/builder"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Builder
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
