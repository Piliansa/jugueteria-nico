export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-8 py-20 text-center">
      <h2 className="text-5xl font-bold">Encontrá el regalo perfecto</h2>

      <p className="mt-6 max-w-2xl text-lg text-gray-500">
        Miles de juguetes, juegos y artículos de librería para todas las edades.
      </p>

      <button className="mt-10 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700">
        Ver catálogo
      </button>
    </section>
  );
}
