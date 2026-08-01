import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroCarousel from "@/components/home/HeroCarousel";
import NewProducts from "@/components/home/NewProducts";
import Brands from "@/components/home/Brands";
import CategoriesNav from "@/components/layout/CategoriesNav";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoriesNav />
      <main>
        <HeroCarousel />
        <CategoryGrid />
        <FeaturedProducts />
        <NewProducts />
        <Brands />
      </main>
      <Footer />
    </>
  );
}

