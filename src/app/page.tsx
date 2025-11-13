import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

// Lazy load de componentes pesados para mejorar performance
const CategoriesSection = dynamic(() => import("@/components/CategoriesSection"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});

const ProductsGrid = dynamic(() => import("@/components/ProductsGrid"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});

const FeaturesSection = dynamic(() => import("@/components/FeaturesSection"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
});

const TeamSection = dynamic(() => import("@/components/TeamSection"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <ProductsGrid />
        <FeaturesSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
