const categorias = [
  "🧸 Bebés",
  "🚗 Autitos",
  "👧 Muñecas",
  "🎲 Juegos",
  "🧩 Rompecabezas",
  "📚 Librería",
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-8 text-3xl font-bold">Explorar categorías</h2>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
        {categorias.map((categoria) => (
          <div
            key={categoria}
            className="cursor-pointer rounded-2xl border bg-white p-6 text-center shadow-sm transition hover:shadow-lg"
          >
            {categoria}
          </div>
        ))}
      </div>
    </section>
  );
}
