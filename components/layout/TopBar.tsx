const PROMO_MESSAGE =
  "Consultá por envíos a Colón, Villa Elisa, Basavilbaso y toda la zona || Retirá en nuestras dos sucursales en Concepción del Uruguay";

export default function TopBar() {
  return (
    <div className="overflow-hidden bg-zinc-950 text-sm text-white">
      <div
        className="flex animate-marquee whitespace-nowrap py-2"
        aria-hidden="true"
      >
        <span className="mx-4">{PROMO_MESSAGE}</span>
        <span className="mx-4">{PROMO_MESSAGE}</span>
        <span className="mx-4">{PROMO_MESSAGE}</span>
        <span className="mx-4">{PROMO_MESSAGE}</span>
      </div>
      {/* versión invisible para lectores de pantalla, se lee una sola vez */}
      <span className="sr-only">{PROMO_MESSAGE}</span>
    </div>
  );
}
