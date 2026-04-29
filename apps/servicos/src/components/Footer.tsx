import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#0A1B3D] border-t border-white/10 py-10 text-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4" aria-label="Gradios">
          <Image src="/logo.webp" alt="Gradios" width={22} height={22} className="rounded opacity-90" />
          <span className="text-sm font-bold text-white/90 tracking-tight">Gradios</span>
        </Link>
        <p className="text-xs text-white/40 mb-1">De Londrina pra todo o Brasil</p>
        <p className="text-xs text-white/25">© {new Date().getFullYear()} Gradios — todos os direitos reservados</p>
      </div>
    </footer>
  );
}
