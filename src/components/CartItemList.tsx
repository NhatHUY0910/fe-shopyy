import React, { useState, useEffect } from 'react';
import { Table, Button, Checkbox, InputNumber, message, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface CartItem {
    productId: number;
    productName: string;
    imageUrl: string;
    price: number;
    quantity: number;
    stockQuantity: number;
}

const CartItemList = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        console.log('Cart items updated:', cartItems);
    }, [cartItems]);

    const fetchCartItems = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            const data = await response.json();
            setCartItems(data.items);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setLoading(false);
        }
    };

    const handleQuantityChange = async (productId: number, value: number | null) => {
        if (value === null) return;
        const numericValue = Number(value);
        console.log(`Product ID: ${productId}, New Value: ${numericValue}`);

        const item = cartItems.find(item => item.productId === productId);
        if (!item) return;

        const maxQuantity = item.quantity + item.stockQuantity;
        console.log(`Item quantity: ${item.quantity}, Stock quantity: ${item.stockQuantity}, Max Quantity: ${maxQuantity}`);

        if (numericValue > maxQuantity) {
            message.warning(`Số lượng tối đa mà bạn có thể đặt mua sản phẩm này là ${maxQuantity}`);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/cart/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ productId, quantity: numericValue }),
            });
            console.log('Server response:', response);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                alert(errorData.message || 'An error occurred while updating the cart')
                message.warning(errorData.message);
                // setCartItems(prevItems =>
                //     prevItems.map(item =>
                //         item.productId === productId
                //             ? { ...item, quantity: item.quantity }
                //             : item
                //     )
                // );
            } else {
                const updatedCart = await response.json();
                console.log('Updated cart:', updatedCart);
                setCartItems(updatedCart.items);
                console.log('Cart items after update:', updatedCart.items);
            }
        } catch (error) {
            // console.error('Error updating cart item quantity:', error);
            console.error('Error in handleQuantityChange:', error);
            message.error('Có lỗi xảy ra khi cập nhật số lượng sản phẩm');
        }
    };

    const handleDecrement = async (productId: number) => {
        const item = cartItems.find(item => item.productId === productId);
        console.log("Found item:", item);
        if (item && item.quantity > 1) {
            try {
                const response = await fetch(`http://localhost:8080/api/cart/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ productId, quantity: item.quantity - 1 }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    message.warning(errorData.message);
                } else {
                    const updatedCart = await response.json();
                    setCartItems(updatedCart.items);
                    console.log('Cart items after update:', updatedCart.items);
                }
            } catch (error) {
                console.error('Error decrementing cart item:', error);
            }
        } else if (item && item.quantity === 1) {
            Modal.confirm({
                title: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?',
                onOk: () => handleDeleteItem(productId),
            });
        }
    };

    const handleIncrement = async (productId: number) => {
        const item = cartItems.find(item => item.productId === productId);
        console.log("Found item:", item);
        if (item) {
            const maxQuantity = item.quantity + item.stockQuantity;
            if (item.quantity >= maxQuantity) {
                message.warning(`Số lượng tối đa mà bạn có thể đặt mua sản phẩm này là ${maxQuantity}`);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/cart/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ productId, quantity: item.quantity + 1 }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    message.warning(errorData.message);
                } else {
                    const updatedCart = await response.json();
                    setCartItems(updatedCart.items);
                    console.log('Cart items after update:', updatedCart.items);
                }
            } catch (error) {
                console.error('Error incrementing cart item:', error);
                message.error('Có lỗi xảy ra khi cập nhật số lượng sản phẩm');
            }
        }
    };

    const handleDeleteItem = async (productId: number) => {
        try {
            const response = await fetch('http://localhost:8080/api/cart/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ productId })
            });

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to remove item from cart');
            }

            const updatedCart = await response.json()
            setCartItems(updatedCart.items);
            message.success('Sản phẩm đã được xóa khỏi giỏ hàng');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            message.error('Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng');
        }
    };

    const handleDeleteAll = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/cart/remove-all', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove all items from cart');
            }

            const updatedCart = await response.json();
            setCartItems(updatedCart.items);
            setSelectedItems([]);
            message.success('Tất cả sản phẩm đã được xóa khỏi giỏ hàng');
        } catch (error) {
            console.error('Error removing all items from cart:', error);
            message.error('Có lỗi xảy ra khi xóa tất cả sản phẩm khỏi giỏ hàng');
        }
    };

    const handleBuySelected = () => {
        const selectedProducts = cartItems.filter(item => selectedItems.includes(item.productId));
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
        router.push('/payment');
    };

    const columns = [
        {
            title: <Checkbox onChange={(e) => {
                setSelectedItems(e.target.checked ? cartItems.map(item => item.productId) : []);
            }} />,
            dataIndex: 'productId',
            key: 'select',
            render: (productId: number) => (
                <Checkbox
                    checked={selectedItems.includes(productId)}
                    onChange={(e) => {
                        setSelectedItems(e.target.checked
                            ? [...selectedItems, productId]
                            : selectedItems.filter(id => id !== productId)
                        );
                    }}
                />
            ),
        },
        {
            title: 'Sản Phẩm',
            dataIndex: 'productName',
            key: 'product',
            render: (text: string, record: CartItem) => (
                <div className="flex items-center">
                    <Image src={`http://localhost:8080/images/${record.imageUrl}`} alt={text} width={100} height={100} className="mr-4" />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: 'Đơn Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `₫${price.toFixed(2)}`,
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity: number, record: CartItem) => (
                <div className="flex items-center">
                    <Button onClick={() => handleDecrement(record.productId)}>-</Button>
                    <InputNumber
                        min={1}
                        // max={quantity + record.stockQuantity}
                        value={quantity}
                        onChange={(value) => {
                            console.log('Input value:', value);
                            handleQuantityChange(record.productId, value);
                        }}
                        className="mx-2"
                    />
                    <Button onClick={() => handleIncrement(record.productId)}>+</Button>
                </div>
            ),
        },
        {
            title: 'Số Tiền',
            key: 'total',
            render: (text: string, record: CartItem) => `₫${(record.price * record.quantity).toFixed(2)}`,
        },
        {
            title: 'Thao Tác',
            key: 'action',
            render: (text: string, record: CartItem) => (
                <Button
                    icon={<DeleteOutlined />}
                    onClick={() => {
                        Modal.confirm({
                            title: 'Xác nhận xóa sản phẩm',
                            content: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
                            onOk: () => handleDeleteItem(record.productId),
                        });
                    }}
                    danger
                >
                    Xóa
                </Button>
            ),
        },
    ];

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div>
            <Table
                columns={columns}
                dataSource={cartItems}
                rowKey="productId"
                loading={loading}
                pagination={false}
            />
            <div className="flex justify-between items-center mt-4">
                <div>
                    <Checkbox
                        onChange={(e) => {
                            setSelectedItems(e.target.checked ? cartItems.map(item => item.productId) : []);
                        }}
                    >
                        Chọn Tất Cả
                    </Checkbox>
                    <Button
                        onClick={() => {
                            Modal.confirm({
                                title: 'Xác nhận xóa tất cả sản phẩm',
                                content: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng không?',
                                onOk: handleDeleteAll,
                            });
                        }}
                        className="ml-4"
                        danger
                    >
                        Xóa Tất Cả
                    </Button>
                </div>
                <div className="text-right">
                    <p>Tổng thanh toán ({totalItems} Sản Phẩm): <span className="text-2xl font-bold text-red-500">₫{totalAmount.toFixed(2)}</span></p>
                    <Button
                        type="primary"
                        size="large"
                        className="mt-2"
                        onClick={handleBuySelected}
                        disabled={selectedItems.length === 0}
                    >
                        Mua Hàng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartItemList;