'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/utils/format';

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrls: string[];
    description: string;
    stockQuantity: number;
}

interface PagedResponse {
    content: Product[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

const SearchResults = () => {
    const searchParams = useSearchParams();
    const keyword = searchParams.get('keyword');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchSearchResults = async (pageNumber: number) => {
        if (!keyword) return;

        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(keyword)}&page=${pageNumber}&size=5`
            );

            if (!response.ok) throw new Error('Failed to fetch search results');

            const data: PagedResponse = await response.json();

            setProducts(prev =>
                pageNumber === 0 ? data.content : [...prev, ...data.content]
            );
            setHasMore(!data.last);
            setPage(data.pageNumber);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setProducts([]);
        setPage(0);
        setHasMore(true);
        fetchSearchResults(0);
    }, [keyword]);

    if (loading && page === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Đang tìm kiếm...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-xl font-semibold mb-4">
                Kết quả tìm kiếm cho &quot;{keyword}&quot;
            </h1>

            {products.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        Không tìm thấy sản phẩm nào phù hợp với nhu cầu của bạn
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <Link
                                href={`/product/${product.id}`}
                                key={product.id}
                                className="group"
                            >
                                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative w-full pt-[100%]">
                                        <Image
                                            src={product.imageUrls[0] || '/placeholder-image.png'}
                                            alt={product.name}
                                            fill
                                            className="absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                        />
                                    </div>

                                    <div className="p-3">
                                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 h-10">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <span className="text-orange-500 font-semibold">
                                                ₫{formatCurrency(product.price)}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                Đã bán {Math.floor(Math.random() * 1000)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => fetchSearchResults(page + 1)}
                                disabled={loading}
                                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
                            >
                                {loading ? 'Đang tải...' : 'Xem thêm'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchResults;
