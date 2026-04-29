import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Gradios — início">
          <Image
            src="/logo.webp"
            alt="Gradios"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="text-sm font-bold text-text tracking-tight">Gradios</span>
        </Link>
      </div>
    </header>
  );
}
