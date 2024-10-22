import AdminProductList from "@/components/AdminProductList";
import HeaderHomepage from "@/components/HeaderHomepage";
import Footer from "@/components/Footer";

export default function AdminHomePage() {
    return (
        <div>
            <HeaderHomepage />
            <main>
                <AdminProductList />
            </main>
            <Footer />
        </div>
    )
}
