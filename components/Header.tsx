export default function Header() {
  return (
    <header className="flex items-center justify-between w-full p-6 border-b">
      <h1 className="text-3xl font-bold text-blue-700">Juguetería Nico</h1>

      <nav>
        <ul className="flex gap-8 font-medium">
          <li>Inicio</li>
          <li>Productos</li>
          <li>Marcas</li>
          <li>Contacto</li>
        </ul>
      </nav>
    </header>
  );
}
