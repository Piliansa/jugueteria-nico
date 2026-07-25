import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import ProductGrid from "@/components/home/ProductGrid";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <Categories />

        <ProductGrid />
      </main>
    </>
  );
}
