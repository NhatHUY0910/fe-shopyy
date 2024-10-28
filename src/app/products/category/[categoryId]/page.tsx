import CategoryProductList from '@/components/CategoryProductList';
import HeaderHomepage from "@/components/HeaderHomepage";
import Footer from "@/components/Footer";

export default function CategoryPage({ params }: { params: { categoryId: string } }) {
    return (
        <div>
            <HeaderHomepage />
            <main>
                <CategoryProductList categoryId={parseInt(params.categoryId)} />
            </main>
            <Footer />
        </div>
    );
}
