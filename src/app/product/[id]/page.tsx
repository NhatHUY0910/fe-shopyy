'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Carousel } from 'antd';

interface ProductColor {
    id: number;
    name: string;
    imageUrl: string;
}

interface ProductDetail {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrls: string[];
    colors?: ProductColor[];
    availableSizes?: string[];
    availableWeights?: string[];
}

const ProductDetailPage: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedWeight, setSelectedWeight] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}/details`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                console.log("Received product data:", data);
                setProduct(data);
                if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0].name);
                if (data.availableSizes && data.availableSizes.length > 0) setSelectedSize(data.availableSizes[0]);
                if (data.availableWeights && data.availableWeights.length > 0) setSelectedWeight(data.availableWeights[0]);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id]);

    const handleQuantityChange = (value: number) => {
        if (product) {
            setQuantity(Math.max(1, Math.min(value, product.stockQuantity)));
        }
    };

    const handleAddToCart = () => {
        console.log('Tính năng này đang được phát triển');
    };

    const handleBuyNow = () => {
        console.log('Chức năng này hiện chưa khả dụng');
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4 mb-8">
                    <Carousel autoplay>
                        {product.imageUrls.map((url, index) => (
                            <div key={index}>
                                <Image src={url} alt={`Product image ${index + 1}`} width={500} height={500} className="w-full h-auto" />
                            </div>
                        ))}
                    </Carousel>
                    <div className="flex mt-4">
                        {product.imageUrls.map((url, index) => (
                            <div key={index} className="w-1/5 px-1">
                                <Image src={url} alt={`Thumbnail ${index + 1}`} width={100} height={100} className="w-full h-auto cursor-pointer" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-1/2 px-4">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-2xl font-bold text-red-600 mb-4">${product.price.toFixed(2)}</p>
                    <div className="mb-4">
                        <p className="font-bold">Chính Sách Trả Hàng</p>
                        <p>Trả hàng 15 ngày</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-bold">Vận Chuyển</p>
                        <p>Miễn phí vận chuyển</p>
                    </div>
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-4">
                            <p className="font-bold mb-2">Màu Sắc</p>
                            <div className="flex flex-wrap">
                                {product.colors.map((color) => (
                                    <div key={color.id} className="flex items-center mr-2 mb-2">
                                        <Image
                                            src={color.imageUrl}
                                            alt={color.name}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        <button
                                            className={`px-4 py-2 border rounded ${selectedColor === color.name ? 'border-blue-500' : 'border-gray-300'}`}
                                            onClick={() => setSelectedColor(color.name)}
                                        >
                                            {color.name}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {product.availableSizes && product.availableSizes.length > 0 && (
                        <div className="mb-4">
                            <p className="font-bold mb-2">Kích Thước</p>
                            <div className="flex flex-wrap">
                                {product.availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`mr-2 mb-2 px-4 py-2 border rounded ${selectedSize === size ? 'border-blue-500' : 'border-gray-300'}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {product.availableWeights && product.availableWeights.length > 0 && (
                        <div className="mb-4">
                            <p className="font-bold mb-2">Trọng Lượng</p>
                            <div className="flex flex-wrap">
                                {product.availableWeights.map((weight) => (
                                    <button
                                        key={weight}
                                        className={`mr-2 mb-2 px-4 py-2 border rounded ${selectedWeight === weight ? 'border-blue-500' : 'border-gray-300'}`}
                                        onClick={() => setSelectedWeight(weight)}
                                    >
                                        {weight}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mb-4">
                        <p className="font-bold mb-2">Số Lượng</p>
                        <div className="flex items-center">
                            <button
                                className="px-3 py-1 border rounded-l"
                                onClick={() => handleQuantityChange(quantity - 1)}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                className="w-16 px-2 py-1 border-t border-b text-center"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                                min={1}
                                max={product.stockQuantity}
                            />
                            <button
                                className="px-3 py-1 border rounded-r"
                                onClick={() => handleQuantityChange(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                            onClick={handleAddToCart}
                        >
                            Thêm Vào Giỏ Hàng
                        </button>
                        <button
                            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={handleBuyNow}
                        >
                            Mua Ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;