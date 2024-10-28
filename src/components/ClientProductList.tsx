'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);

    const fetchProducts = useCallback(async (pageNumber: number) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/products/paginated?page=${pageNumber}&size=5`
            );
            if (!response.ok) throw new Error('Failed to fetch products');
            const data: PagedResponse = await response.json();

            setProducts(prevProducts =>
                pageNumber === 0 ? data.content : [...prevProducts, ...data.content]
            );
            setHasMore(!data.last);
            setPage(data.pageNumber);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        fetchProducts(0);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const sectionRect = sectionRef.current.getBoundingClientRect();
                const isSticky = sectionRect.top <= 0;
                setIsHeaderSticky(isSticky);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSimilarClick = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('Tính năng tìm sản phẩm tương tự đang được phát triển');
    };

    return (
        <div ref={sectionRef} className="relative">
            {/* Sticky Header */}
            <div className={`bg-white z-10 w-full ${isHeaderSticky ? 'sticky top-0 shadow-md' : ''}`}>
                <div className="container mx-auto px-4 flex justify-center">
                    <h2 className="text-xl font-medium text-[#ee4d2d] py-4 uppercase">
                        Gợi ý hôm nay
                    </h2>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <Link
                            href={`/product/${product.id}/details`}
                            key={product.id}
                            className="group relative block"
                        >
                            <div className="border rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:border-[#0866FF]">
                                {/* Product Image */}
                                <div className="relative w-full pt-[100%]">
                                    <Image
                                        src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder-image.png'}
                                        alt={product.name}
                                        fill
                                        className="absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                    />
                                </div>

                                {/* Product Info Container */}
                                <div className="p-3 pb-12">
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

                                {/* Similar Products Button */}
                                <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={handleSimilarClick}
                                        className="w-full py-2 text-white text-sm bg-[#0866FF] hover:bg-[#0756d6] transition-colors duration-200"
                                    >
                                        Tìm sản phẩm tương tự
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => fetchProducts(page + 1)}
                            disabled={loading}
                            className="px-6 py-2 bg-[#0866FF] text-white rounded-lg hover:bg-[#0756d6] disabled:bg-gray-400 transition-colors duration-200"
                        >
                            {loading ? 'Đang tải...' : 'Xem thêm'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
