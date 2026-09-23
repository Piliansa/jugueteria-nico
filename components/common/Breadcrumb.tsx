import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string; // si no tiene href, es el paso actual (no clickeable)
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-zinc-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">›</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-red-600 dark:hover:text-red-400">
                {item.label}
              </Link>
            ) : (
              <span
                className="font-medium text-gray-700 dark:text-zinc-200"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
