'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Carousel, message } from 'antd';

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
    const router = useRouter();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedWeight, setSelectedWeight] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [hoveredColorId, setHoveredColorId] = useState<number | null>(null);
    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
    const [defaultImage, setDefaultImage] = useState<string>('');

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/products/${id}/details`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                // Kiểm tra và xử lý dữ liệu trước khi set state
                if (data && data.imageUrls) {
                    // Đảm bảo imageUrls là một mảng
                    data.imageUrls = Array.isArray(data.imageUrls) ? data.imageUrls : [];
                    setDefaultImage(data.imageUrls[0] || '/placeholder-image.png');
                }
                console.log("Received product data:", data);
                setProduct(data);

                // Đặt giá trị mặc định cho các thuộc tính nếu có
                if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0].name);
                if (data.availableSizes && data.availableSizes.length > 0) setSelectedSize(data.availableSizes[0]);
                if (data.availableWeights && data.availableWeights.length > 0) setSelectedWeight(data.availableWeights[0]);
            } catch (error) {
                console.error('Error fetching product details:', error);
                message.error('Không thể tải thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id]);

    const handleQuantityChange = (value: number) => {
        if (product) {
            const newQuantity = Math.max(1, Math.min(value, product.stockQuantity));
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        // Kiểm tra người dùng đã đăng nhập chưa
        if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
        }

        // Kiểm tra việc chọn các thuộc tính bắt buộc
        let missingAttributes = [];

        if (product?.colors && product.colors.length > 0 && !selectedColor) {
            missingAttributes.push('màu sắc');
        }

        if (product?.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
            missingAttributes.push('kích thước');
        }

        if (product?.availableWeights && product.availableWeights.length > 0 && !selectedWeight) {
            missingAttributes.push('trọng lượng');
        }

        if (missingAttributes.length > 0) {
            message.error(`Vui lòng chọn ${missingAttributes.join(', ')} cho sản phẩm`);
            return;
        }

        // Kiểm tra số lượng
        if (!quantity || quantity < 1) {
            message.error('Vui lòng chọn số lượng hợp lệ');
            return;
        }

        if (product && quantity > product.stockQuantity) {
            message.error('Số lượng sản phẩm vượt quá số lượng trong kho');
            return;
        }

        try {
            const selectedColorObj = product?.colors?.find(color => color.name === selectedColor);

            const addToCartDto = {
                productId: product?.id,
                quantity: quantity,
                colorId: selectedColorObj?.id || null,
                size: selectedSize || null,
                weight: selectedWeight || null
            };

            const response = await fetch('http://localhost:8080/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(addToCartDto),
            });

            if (!response.ok) {
                throw new Error('Failed to add product to cart');
            }

            message.success('Sản phẩm đã được thêm vào giỏ hàng');

            // Cập nhật lại số lượng sản phẩm còn lại
            setProduct(prev => prev ? {
                ...prev,
                stockQuantity: prev.stockQuantity - quantity
            } : null);

            // Reset số lượng về 1
            setQuantity(1);

        } catch (error) {
            console.error('Error adding product to cart:', error);
            message.error('Không thể thêm sản phẩm vào giỏ hàng');
        }
    };

    const handleBuyNow = () => {
        console.log('Chức năng này hiện chưa khả dụng');
        message.info('Tính năng này đang được phát triển');
    };

    // Hàm xử lý khi hover vào hình ảnh nhỏ
    const handleThumbnailHover = (index: number) => {
        setHoveredImageIndex(index);
    };

    // Hàm xử lý khi không còn hover
    const handleThumbnailLeave = () => {
        setHoveredImageIndex(null);
    };

    // Hàm xử lý khi click vào hình ảnh nhỏ
    const handleThumbnailClick = (index: number) => {
        if (selectedImageIndex === index) {
            setSelectedImageIndex(null);
        } else {
            setSelectedImageIndex(index);
            // Reset color selection khi chọn thumbnail mới
            setSelectedColorId(null);
        }
    };

    // Xử lý hover và click cho màu sắc
    const handleColorHover = (colorId: number) => {
        setHoveredColorId(colorId);
    };

    const handleColorLeave = () => {
        setHoveredColorId(null);
    };

    const handleColorClick = (colorId: number, colorName: string) => {
        if (selectedColorId === colorId) {
            setSelectedColorId(null);
            setSelectedColor('');
        } else {
            setSelectedColorId(colorId);
            setSelectedColor(colorName);
            // Reset thumbnail selection khi chọn màu mới
            setSelectedImageIndex(null);
        }
    };

    // Hàm để xác định hình ảnh nào sẽ được hiển thị trong phần hình ảnh lớn
    const getCurrentDisplayImage = (): string => {
        if (!product || (!product.imageUrls?.length && !product.colors?.length)) {
            return '/placeholder-image.png';
        }

        // Ưu tiên hiển thị hình ảnh màu đang hover
        if (hoveredColorId !== null) {
            const hoveredColor = product.colors?.find(color => color.id === hoveredColorId);
            if (hoveredColor?.imageUrl) {
                return hoveredColor.imageUrl;
            }
        }

        // Tiếp theo là hình ảnh thumbnail đang hover
        if (hoveredImageIndex !== null && product.imageUrls[hoveredImageIndex]) {
            return product.imageUrls[hoveredImageIndex];
        }

        // Tiếp theo là hình ảnh màu đang được chọn
        if (selectedColorId !== null) {
            const selectedColor = product.colors?.find(color => color.id === selectedColorId);
            if (selectedColor?.imageUrl) {
                return selectedColor.imageUrl;
            }
        }

        // Tiếp theo là hình ảnh thumbnail đang được chọn
        if (selectedImageIndex !== null && product.imageUrls[selectedImageIndex]) {
            return product.imageUrls[selectedImageIndex];
        }

        // Cuối cùng là hình ảnh mặc định
        return defaultImage;
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center min-h-screen">Không tìm thấy sản phẩm</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap -mx-4">
                {/* Phần hiển thị hình ảnh sản phẩm */}
                <div className="w-full md:w-1/2 px-4 mb-8">
                    {/* Hình ảnh lớn */}
                    <div className="relative aspect-square mb-4">
                        {getCurrentDisplayImage() && (
                            <Image
                                src={getCurrentDisplayImage()}
                                alt={product.name || 'Product image'}
                                fill
                                className="object-cover"
                                priority
                                onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    img.src = '/placeholder-image.png';
                                }}
                            />
                        )}
                    </div>

                    {/* Danh sách hình ảnh nhỏ */}
                    <div className="flex gap-2">
                        {product.imageUrls?.map((url, index) => (
                            <div
                                key={index}
                                className={`relative w-20 aspect-square cursor-pointer transition-all
                ${selectedImageIndex === index ? 'border-2 border-blue-500' : 'border border-gray-200'}
                hover:border-blue-300`}
                                onMouseEnter={() => handleThumbnailHover(index)}
                                onMouseLeave={handleThumbnailLeave}
                                onClick={() => handleThumbnailClick(index)}
                            >
                                {url && (
                                    <Image
                                        src={url}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            img.src = '/placeholder-image.png';
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phần thông tin sản phẩm */}
                <div className="w-full md:w-1/2 px-4">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-2xl font-bold text-red-600 mb-4">${product.price.toFixed(2)}</p>

                    {/* Phần chính sách */}
                    <div className="mb-4">
                        <p className="font-bold">Chính Sách Trả Hàng</p>
                        <p>Trả hàng 15 ngày</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-bold">Vận Chuyển</p>
                        <p>Miễn phí vận chuyển</p>
                    </div>

                    {/* Phần lựa chọn màu sắc */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-4">
                            <p className="font-bold mb-2">Màu Sắc</p>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.id}
                                        className={`flex items-center px-4 py-2 border rounded-lg transition-all
                                            ${selectedColorId === color.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
                                        onClick={() => handleColorClick(color.id, color.name)}
                                        onMouseEnter={() => handleColorHover(color.id)}
                                        onMouseLeave={handleColorLeave}
                                    >
                                        {color.imageUrl && (
                                            <Image
                                                src={color.imageUrl}
                                                alt={color.name || 'Color image'}
                                                width={24}
                                                height={24}
                                                className="mr-2 rounded-full"
                                                onError={(e) => {
                                                    const img = e.target as HTMLImageElement;
                                                    img.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        )}
                                        <span>{color.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Phần lựa chọn kích thước */}
                    {product.availableSizes && product.availableSizes.length > 0 && (
                        <div className="mb-4">
                            <p className="font-bold mb-2">Kích Thước</p>
                            <div className="flex flex-wrap gap-2">
                                {product.availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`px-4 py-2 border rounded-lg transition-all
                                            ${selectedSize === size
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-300'}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Phần lựa chọn trọng lượng */}
                    {product.availableWeights && product.availableWeights.length > 0 && (
                        <div className="mb-4">
                            <p className="font-bold mb-2">Trọng Lượng</p>
                            <div className="flex flex-wrap gap-2">
                                {product.availableWeights.map((weight) => (
                                    <button
                                        key={weight}
                                        className={`px-4 py-2 border rounded-lg transition-all
                                            ${selectedWeight === weight
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-300'}`}
                                        onClick={() => setSelectedWeight(weight)}
                                    >
                                        {weight}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Phần chọn số lượng */}
                    <div className="mb-6">
                        <p className="font-bold mb-2">Số Lượng</p>
                        <div className="flex items-center space-x-2">
                            <button
                                className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                className="w-20 px-2 py-1 border rounded-lg text-center"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                                min={1}
                                max={product.stockQuantity}
                            />
                            <button
                                className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={quantity >= product.stockQuantity}
                            >
                                +
                            </button>
                            <span className="text-gray-600 ml-2">
                                {product.stockQuantity} sản phẩm có sẵn
                            </span>
                        </div>
                    </div>

                    {/* Phần nút thao tác */}
                    <div className="flex space-x-4">
                        <button
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                                     transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={handleAddToCart}
                            disabled={product.stockQuantity === 0}
                        >
                            {product.stockQuantity === 0 ? 'Hết hàng' : 'Thêm Vào Giỏ Hàng'}
                        </button>
                        <button
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700
                                     transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={handleBuyNow}
                            disabled={product.stockQuantity === 0}
                        >
                            {product.stockQuantity === 0 ? 'Hết hàng' : 'Mua Ngay'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
