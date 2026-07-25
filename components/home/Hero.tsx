export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-red-50 to-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full bg-red-100 px-4 py-2 font-semibold text-red-600">
          🎁 Día del Niño
        </span>

        <h1 className="mt-8 text-6xl font-extrabold text-gray-900">
          Encontrá el regalo perfecto en Juguetería Nico
        </h1>

        <p className="mt-6 max-w-3xl text-xl text-gray-600">
          Descubrí juguetes, juegos, artículos de librería y regalos para todas
          las edades.
        </p>
        <p className="mt-3 max-w-2xl text-base text-gray-500">
          <span className="font-semibold text-red-600">Desde 1991</span>{" "}
          acompañando a las familias de Concepción del Uruguay con juguetes,
          artículos de librería y regalos para todas las edades.
        </p>
        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-red-600 px-8 py-4 font-semibold text-white hover:bg-red-700">
            Ver catálogo
          </button>

          <button className="rounded-xl border px-8 py-4 font-semibold">
            Ver promociones
          </button>
        </div>
      </div>
    </section>
  );
}
