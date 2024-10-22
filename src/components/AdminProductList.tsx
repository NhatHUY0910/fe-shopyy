'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {Button, List, message, Modal} from 'antd';
import CreateProductForm from "@/components/CreateProductForm";

interface Product {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
    description: string;
    producer: string;
    imageUrls: string[];
    category: {
        name: string;
    };
}

interface PagedResponse {
    content: Product[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

const AdminProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const { user } = useAuthContext();
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = useCallback(async (pageNumber: number) => {
        if (isLoading || !Number.isInteger(pageNumber)) return;
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/products/paginated?page=${pageNumber}&size=5`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data: PagedResponse = await response.json();

            // Update products based on page number
            if (pageNumber === 0) {
                setProducts(data.content);
            } else {
                setProducts(prevProducts => [...prevProducts, ...data.content]);
            }
            setHasMore(!data.last);
            setPage(data.pageNumber);

            const newQuantities = data.content.reduce((acc, product) => ({
                ...acc,
                [product.id]: 1
            }), {});
            setQuantities(prev => ({ ...prev, ...newQuantities }));
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    useEffect(() => {
        fetchProducts(0);
    }, []);

    const loadMore = () => {
        if (!isLoading) {
            const nextPage = page + 1;
            if (Number.isInteger(nextPage)) {
                fetchProducts(nextPage);
            }
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleCreateProduct = async (newProduct: Product) => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
        setIsModalVisible(false);
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center my-4">
                <h1 className="text-2xl font-bold">Product List</h1>
                <Button type="primary" onClick={showModal}>Thêm sản phẩm mới</Button>
            </div>
            <Modal
                title="Tạo sản phẩm mới"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <CreateProductForm onFinish={handleCreateProduct} />
            </Modal>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Stock Quantity</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Producer</th>
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Category</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td className="border px-4 py-2">{product.id}</td>
                        <td className="border px-4 py-2">{product.name}</td>
                        <td className="border px-4 py-2">${product.price}</td>
                        <td className="border px-4 py-2">{product.stockQuantity}</td>
                        <td className="border px-4 py-2">{product.description || 'N/A'}</td>
                        <td className="border px-4 py-2">{product.producer || 'N/A'}</td>
                        <td className="border px-4 py-2">
                            <img
                                src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder-image.png'}
                                alt={product.name}
                                className="w-24 h-24 object-cover"
                            />
                        </td>
                        <td className="border px-4 py-2">{product.category ? product.category.name : 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {hasMore && (
                <div className="text-center my-4">
                    <Button onClick={loadMore} loading={isLoading}>
                        {isLoading ? 'Đang tải...' : 'Xem thêm'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AdminProductList;
