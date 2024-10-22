import AdminProductList from '@/components/AdminProductList';
import ClientProductList from '@/components/ClientProductList';
import HeaderHomepage from "@/components/HeaderHomepage";
import Footer from "@/components/Footer";

export default function Home() {
  return (
          <div>
              <HeaderHomepage />
              <main>
                  <ClientProductList />
              </main>
            <Footer />
          </div>
    );
}
