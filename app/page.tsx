import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroCarousel from "@/components/home/HeroCarousel";
import NewProducts from "@/components/home/NewProducts";
import Brands from "@/components/home/Brands";
import CategoriesNav from "@/components/layout/CategoriesNav";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import GoogleReviews from "@/components/common/GoogleReviews";
import Reveal from "@/components/common/Reveal";

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <CategoriesNav />
      <main>
        <HeroCarousel />
        <Reveal>
          <CategoryGrid />
        </Reveal>
        <Reveal delay={100}>
          <FeaturedProducts />
        </Reveal>
        <Reveal delay={100}>
          <NewProducts />
        </Reveal>
        <Reveal delay={100}>
          <Brands />
        </Reveal>
      </main>
      <GoogleReviews />
      <Footer />
    </>
  );
}
