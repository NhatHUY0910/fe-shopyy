'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {Button, message, Modal} from 'antd';
import CreateProductForm from "@/components/CreateProductForm";

interface Product {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
    description: string;
    producer: string;
    imageUrl: string;
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

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const { user } = useAuthContext();
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = useCallback(async (pageNumber: number) => {
        if (isLoading) return;
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
            if (pageNumber === 0) {
                setProducts(data.content);
            } else {
                setProducts(prevProducts => [...prevProducts, ...data.content]);
            }
            setHasMore(!data.last);
            setPage(data.pageNumber);

            const newQuantities = data.content.reduce((acc: { [key: number]: number }, product: Product) => {
                acc[product.id] = 1;
                return acc;
            }, {});
            setQuantities(prev => ({ ...prev, ...newQuantities }));
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(0);
    }, [fetchProducts]);

    const loadMore = () => {
        fetchProducts(page + 1);
    };

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const validQuantity = Math.min(Math.max(1, newQuantity), product.stockQuantity);
            setQuantities(prev => ({ ...prev, [productId]: validQuantity }));
        }
    };

    const handleDecreaseQuantity = (productId: number) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, prev[productId] - 1)
        }));
    };

    const handleIncreaseQuantity = (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setQuantities(prev => ({
                ...prev,
                [productId]: Math.min(product.stockQuantity, prev[productId] + 1)
            }));
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

    const handleAddToCart = async (productId: number) => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantities[productId]
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add product to cart');
            }

            message.success('Product added to cart successfully');

            // Update the local state to reflect the new stock quantity
            setProducts(prevProducts => prevProducts.map(product =>
                product.id === productId
                    ? { ...product, stockQuantity: product.stockQuantity - quantities[productId] }
                    : product
            ));

            // Reset quantity to 1 after successful addition
            setQuantities(prev => ({ ...prev, [productId]: 1 }));
        } catch (error) {
            console.error('Error adding product to cart:', error);
            message.error('Failed to add product to cart');
        }
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
                    <th className="px-4 py-2">Action</th>
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
                            <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover"/>
                        </td>
                        <td className="border px-4 py-2">{product.category ? product.category.name : 'N/A'}</td>
                        <td className="border px-4 py-2">
                            <div className="flex items-center">
                                <button onClick={() => handleDecreaseQuantity(product.id)}
                                        className="bg-gray-200 px-2 py-1 rounded">-
                                </button>
                                <input
                                    type="number"
                                    className="w-16 text-center mx-2"
                                    value={quantities[product.id] || 1}
                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                    min={1}
                                    max={product.stockQuantity}
                                />
                                <button onClick={() => handleIncreaseQuantity(product.id)}
                                        className="bg-gray-200 px-2 py-1 rounded">+
                                </button>
                            </div>
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                                disabled={product.stockQuantity < 1}
                            >
                                {product.stockQuantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </td>
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

export default ProductList;