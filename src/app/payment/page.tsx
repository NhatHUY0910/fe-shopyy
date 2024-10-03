'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderPayment from "@/components/HeaderPayment";
import PaymentForm from '@/components/PaymentInformationForm';
import PaymentSummary from '@/components/PaymentSummary';
import { message } from "antd";
import { createOrder } from "@/services/orderService";
import { useAuthContext } from "@/context/AuthContext"

interface PaymentInfo {
    fullName: string;
    phoneNumber: string;
    address: string;
}

interface Product {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

const PaymentPage = () => {
    const [showForm, setShowForm] = useState(true);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const router = useRouter();

    useEffect(() => {
        const products = JSON.parse(localStorage.getItem('selectedProducts') || '[]');
        console.log('Parsed products from localStorage:', products);
        setSelectedProducts(products);
        
        if (products.length === 0) {
            router.push('/error');
        }
    }, [router]);

    const handleFormSubmit = (values: PaymentInfo) => {
        setPaymentInfo(values);
        setShowForm(false);
    };

    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method.toUpperCase());
    };

    const handlePlaceOrder = async () => {
        if (!paymentInfo) {
            message.error('Vui lòng nhập thông tin giao hàng')
            return;
        }

        console.log('selectedProducts:', selectedProducts);
        const orderData = {
            fullName: paymentInfo.fullName,
            phoneNumber: paymentInfo.phoneNumber,
            address: paymentInfo.address,
            // paymentMethod,
            paymentMethod: paymentMethod.toUpperCase(), // Đảm bảo gửi giá trị chữ hoa
            orderItems: selectedProducts.map(product => ({
                productId: product.productId,
                quantity: product.quantity
            }))
        };

        try {
            const response = await createOrder(orderData);

            if (paymentMethod.toUpperCase() === 'VNPAY' && response.paymentUrl) {
                // Redirect to VNPay payment URL
                window.location.href = response.paymentUrl;
            } else if (paymentMethod.toUpperCase() === 'COD') {
                // Handle COD payment
                message.success('Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.');
                router.push('/order-success');
            } else {
                // Handle credit/debit card payment (not implemented)
                console.log('Thanh toán bằng thẻ tín dụng/ghi nợ chưa được triển khai');
                message.info('Phương thức thanh toán này chưa được hỗ trợ.');
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.');
        }
    };

    const handleChangeInfo = () => {
        setShowForm(true);
    };

    return (
        <>
            <HeaderPayment />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>

                {showForm && <PaymentForm onSubmit={handleFormSubmit} />}

                {!showForm && paymentInfo && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Thông tin giao hàng</h2>
                        <p><strong>Họ tên:</strong> {paymentInfo.fullName}</p>
                        <p><strong>Số điện thoại:</strong> {paymentInfo.phoneNumber}</p>
                        <p><strong>Địa chỉ:</strong> {paymentInfo.address}</p>
                        <button
                            onClick={handleChangeInfo}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Thay đổi
                        </button>
                    </div>
                )}

                {!showForm && (
                    <PaymentSummary
                        products={selectedProducts}
                        shippingFee={30000}
                        onPaymentMethodChange={handlePaymentMethodChange}
                        onPlaceOrder={handlePlaceOrder}
                    />
                )}
            </div>
        </>
    );
};

export default PaymentPage;