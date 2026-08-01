import { siteConfig } from "@/config/site";

export default function TopBar() {
  return (
    <div className="bg-zinc-950 text-sm text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p>{siteConfig.city} - Dos sucursales</p>
        <a className="font-semibold hover:text-amber-300" href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">
          Consultanos por WhatsApp
        </a>
      </div>
    </div>
  );
}

