import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    colors?: string[];
    sizes?: string[];
    weights?: string[];
    stockQuantity: number;
}

const ProductDetail: React.FC<{ product: Product }> = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState(product.imageUrls[0]);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
    const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
    const [selectedWeight, setSelectedWeight] = useState(product.weights ? product.weights[0] : null);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentIndex = product.imageUrls.indexOf(selectedImage);
            const nextIndex = (currentIndex + 1) % product.imageUrls.length;
            setSelectedImage(product.imageUrls[nextIndex]);
        }, 5000);

        return () => clearInterval(timer);
    }, [selectedImage, product.imageUrls]);

    const handleQuantityChange = (value: number) => {
        setQuantity(Math.max(1, Math.min(value, product.stockQuantity)));
    };

    const handleAddToCart = () => {
        console.log('Tính năng này đang được phát triển');
    };

    const handleBuyNow = () => {
        console.log('Chức năng này hiện chưa khả dụng');
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
                <Carousel autoplay>
                    {product.imageUrls.map((url, index) => (
                        <div key={index}>
                            <img src={url} alt={`Product ${index + 1}`} className="w-full h-auto" />
                        </div>
                    ))}
                </Carousel>
                <div className="flex mt-4 gap-2">
                    {product.imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-16 h-16 object-cover cursor-pointer"
                            onClick={() => setSelectedImage(url)}
                        />
                    ))}
                </div>
            </div>
            <div className="md:w-1/2">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-3xl font-bold text-red-600 mb-4">₫{product.price.toLocaleString()}</p>
                <div className="mb-4">
                    <p className="font-semibold">Chính Sách Trả Hàng</p>
                    <p>Trả hàng 15 ngày</p>
                </div>
                <div className="mb-4">
                    <p className="font-semibold">Vận Chuyển</p>
                    <p>Miễn phí vận chuyển</p>
                </div>
                {product.colors && (
                    <div className="mb-4">
                        <p className="font-semibold mb-2">Màu Sắc</p>
                        <div className="flex gap-2">
                            {product.colors.map((color, index) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 border rounded ${selectedColor === color ? 'border-blue-500' : 'border-gray-300'}`}
                                    onClick={() => setSelectedColor(color)}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {product.sizes && (
                    <div className="mb-4">
                        <p className="font-semibold mb-2">Kích Thước</p>
                        <div className="flex gap-2">
                            {product.sizes.map((size, index) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 border rounded ${selectedSize === size ? 'border-blue-500' : 'border-gray-300'}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {product.weights && (
                    <div className="mb-4">
                        <p className="font-semibold mb-2">Trọng Lượng</p>
                        <div className="flex gap-2">
                            {product.weights.map((weight, index) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 border rounded ${selectedWeight === weight ? 'border-blue-500' : 'border-gray-300'}`}
                                    onClick={() => setSelectedWeight(weight)}
                                >
                                    {weight}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mb-4">
                    <p className="font-semibold mb-2">Số Lượng</p>
                    <div className="flex items-center">
                        <button
                            className="px-3 py-1 border rounded-l"
                            onClick={() => handleQuantityChange(quantity - 1)}
                        >
                            <MinusOutlined />
                        </button>
                        <input
                            type="number"
                            className="w-16 text-center border-t border-b"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(Number(e.target.value))}
                            min={1}
                            max={product.stockQuantity}
                        />
                        <button
                            className="px-3 py-1 border rounded-r"
                            onClick={() => handleQuantityChange(quantity + 1)}
                        >
                            <PlusOutlined />
                        </button>
                        <span className="ml-2 text-gray-500">{product.stockQuantity} sản phẩm có sẵn</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={handleAddToCart}
                    >
                        Thêm Vào Giỏ Hàng
                    </button>
                    <button
                        className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                        onClick={handleBuyNow}
                    >
                        Mua Ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;