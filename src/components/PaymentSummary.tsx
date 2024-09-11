import React from 'react';
import { Table, Radio, Button } from 'antd';
import { CreditCardOutlined, WalletOutlined, DollarOutlined } from '@ant-design/icons';
import Image from "next/image";

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: String;
}

interface PaymentSummaryProps {
    products: Product[];
    shippingFee: number;
    onPaymentMethodChange: (method: string) => void;
    onPlaceOrder: () => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({products, shippingFee, onPaymentMethodChange, onPlaceOrder,}) => {
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'product',
            render: (text: string, record: Product) => (
                <div className="flex items-center">
                    <Image
                        src={`http://localhost:8080/images/${record.imageUrl}`}
                        alt={text}
                        width={100}
                        height={100}
                        className="mr-4"
                    />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `₫${price.toFixed(2)}`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (text: string, record: Product) => `₫${(record.price * record.quantity).toFixed(2)}`,
        },
    ];

    const totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-2">Sản phẩm đã chọn</h2>
                <Table columns={columns} dataSource={products} pagination={false} />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Phương thức thanh toán</h2>
                <Radio.Group onChange={(e) => onPaymentMethodChange(e.target.value)} defaultValue="creditCard">
                    <Radio value="creditCard">
                        <CreditCardOutlined /> Thẻ tín dụng/ghi nợ
                    </Radio>
                    <Radio value="vnpay">
                        <WalletOutlined /> Ví VNPay
                    </Radio>
                    <Radio value="cod">
                        <DollarOutlined /> Thanh toán khi nhận hàng
                    </Radio>
                </Radio.Group>
            </div>

            <div className="bg-gray-100 p-4 rounded">
                <div className="flex justify-between mb-2">
                    <span>Tổng tiền hàng:</span>
                    <span>₫{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Phí vận chuyển:</span>
                    <span>₫{shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                    <span>Tổng thanh toán:</span>
                    <span>₫{(totalAmount + shippingFee).toFixed(2)}</span>
                </div>
            </div>

            <Button type="primary" size="large" onClick={onPlaceOrder} className="w-full">
                Đặt hàng
            </Button>
        </div>
    );
};

export default PaymentSummary;