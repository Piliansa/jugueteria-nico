import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Image
          src="/logo.png"
          alt="Juguetería Nico"
          width={170}
          height={70}
          priority
        />

        <nav>
          <ul className="flex items-center gap-8 font-medium text-gray-700">
            <li className="cursor-pointer hover:text-red-600">Inicio</li>
            <li className="cursor-pointer hover:text-red-600">Catálogo</li>
            <li className="cursor-pointer hover:text-red-600">Promociones</li>
            <li className="cursor-pointer hover:text-red-600">Contacto</li>
          </ul>
        </nav>

        <button className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600">
          WhatsApp
        </button>
      </div>
    </header>
  );
}
