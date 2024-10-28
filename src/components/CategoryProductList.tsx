'use client'

import React, { useCallback, useEffect, useState } from 'react';
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

interface Category {
    id: number;
    name: string;
}

interface PagedResponse {
    content: Product[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

interface CategoryProductsProps {
    categoryId: number;
}

const CategoryProductList: React.FC<CategoryProductsProps> = ({ categoryId }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Fetch category details
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/categories/${categoryId}`);
                if (!response.ok) throw new Error('Failed to fetch category');
                const data = await response.json();
                setCategory(data);
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };

        fetchCategory();
    }, [categoryId]);

    // Fetch products by category
    const fetchProducts = useCallback(async (pageNumber: number) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/products/category/${categoryId}/paginated?page=${pageNumber}&size=5`
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
    }, [categoryId, loading]);

    useEffect(() => {
        fetchProducts(0);
    }, [categoryId]);

    if (!category) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Category Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {category.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {products.length} sản phẩm
                </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                    <Link
                        href={`/product/${product.id}`}
                        key={product.id}
                        className="group"
                    >
                        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {/* Product Image */}
                            <div className="relative w-full pt-[100%]">
                                <Image
                                    src={product.imageUrls && product.imageUrls.length > 0
                                        ? product.imageUrls[0]
                                        : '/placeholder-image.png'}
                                    alt={product.name}
                                    fill
                                    className="absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                />
                            </div>

                            {/* Product Info */}
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

            {/* Load More Button */}
            {hasMore && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => fetchProducts(page + 1)}
                        disabled={loading}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Đang tải...' : 'Xem thêm'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoryProductList;
