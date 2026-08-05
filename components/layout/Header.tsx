import Image from "next/image";
import Link from "next/link";
import ProductSearch from "@/components/layout/ProductSearch";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center">
        <Link href="/" className="shrink-0" aria-label="Ir al inicio">
          <Image
            src="/logo.png"
            alt="Juguetería Nico"
            width={160}
            height={70}
            priority
          />
        </Link>

        <ProductSearch />

        <Link
          href="/catalogo"
          className="text-sm font-bold text-zinc-800 hover:text-red-600"
        >
          Ver catálogo
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
