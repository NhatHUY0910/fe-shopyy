import AdminProductList from '@/components/AdminProductList';
import ClientProductList from '@/components/ClientProductList';
import CategoryList from "@/components/CategoryList";
import HeaderHomepage from "@/components/HeaderHomepage";
import Footer from "@/components/Footer";

export default function Home() {
  return (
          <div>
              <HeaderHomepage />
              <main>
                  <CategoryList />
                  <ClientProductList />
              </main>
            <Footer />
          </div>
    );
}
