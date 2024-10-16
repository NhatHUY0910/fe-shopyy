import ProductList from '@/components/ProductList';
import HeaderHomepage from "@/components/HeaderHomepage";
import Footer from "@/components/Footer";

export default function Home() {
  return (
          <div>
              <HeaderHomepage />
              <main>
                  <ProductList />
              </main>
            <Footer />
          </div>
    );
}
