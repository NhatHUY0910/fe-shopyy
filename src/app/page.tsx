import ProductList from '@/components/ProductList';
import HeaderHomepage from "@/components/HeaderHomepage";
import Footer from "@/components/Footer";

export default function Home() {
  return (
      <>
          <HeaderHomepage />
          <div className="flex min-h-screen flex-col items-center justify-between p-24">
              <main>
                  <ProductList />
              </main>
          </div>
          <Footer />
      </>
  );
}
