// components/common/GoogleReviews.tsx
"use client";

import Script from "next/script";

export default function GoogleReviews() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <h2 className="mb-4 text-xl font-bold">Lo que dicen nuestros clientes</h2>

      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
      />
      <div
        className="elfsight-app-e9483eb4-9045-46c2-8938-d4ae05001720"
        data-elfsight-app-lazy
      />
    </section>
  );
}
