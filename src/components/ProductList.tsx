'use client';

import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { message } from 'antd';

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

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const { user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/products', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
                const initialQuantities = data.reduce((acc: { [key: number]: number }, product: Product) => {
                    acc[product.id] = 1;
                    return acc;
                }, {});
                setQuantities(initialQuantities);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

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

            // Reset quantity to 1 after successful addition
            setQuantities(prev => ({ ...prev, [productId]: 1 }));
        } catch (error) {
            console.error('Error adding product to cart:', error);
            message.error('Failed to add product to cart');
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold my-4">Product List</h1>
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
                            <img src={`http://localhost:8080/images/${product.imageUrl}`} alt={product.name} className="w-24 h-24 object-cover" />
                        </td>
                        <td className="border px-4 py-2">{product.category ? product.category.name : 'N/A'}</td>
                        <td className="border px-4 py-2">
                            <div className="flex items-center">
                                <button onClick={() => handleDecreaseQuantity(product.id)} className="bg-gray-200 px-2 py-1 rounded">-</button>
                                <input
                                    type="number"
                                    className="w-16 text-center mx-2"
                                    value={quantities[product.id] || 1}
                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                    min={1}
                                    max={product.stockQuantity}
                                />
                                <button onClick={() => handleIncreaseQuantity(product.id)} className="bg-gray-200 px-2 py-1 rounded">+</button>
                            </div>
                            <button onClick={() => handleAddToCart(product.id)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Add to Cart</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;