import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="mt-20 bg-zinc-950 text-zinc-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3">
        <div><h2 className="text-xl font-black text-white">{siteConfig.name}</h2><p className="mt-3 text-sm">Desde {siteConfig.foundedYear}, acompanando a las familias de {siteConfig.city}.</p></div>
        <div><h3 className="font-bold text-white">Sucursales</h3>{siteConfig.locations.map((location) => <p key={location} className="mt-2 text-sm">{location}</p>)}</div>
        <div><h3 className="font-bold text-white">Horarios</h3><p className="mt-2 text-sm">{siteConfig.hours.weekdays}</p><p className="mt-2 text-sm">{siteConfig.hours.saturday}</p><a className="mt-4 inline-block font-bold text-amber-300" href={siteConfig.instagram} target="_blank" rel="noreferrer">{siteConfig.instagramHandle}</a></div>
      </div>
    </footer>
  );
}

