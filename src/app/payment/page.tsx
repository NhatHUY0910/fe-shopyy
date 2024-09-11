'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentForm from '@/components/PaymentInformationForm';
import PaymentSummary from '@/components/PaymentSummary';

interface PaymentInfo {
    fullName: string;
    phoneNumber: string;
    address: string;
}

const PaymentPage = () => {
    const [showForm, setShowForm] = useState(true);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch selected products from localStorage or API
        const products = JSON.parse(localStorage.getItem('selectedProducts') || '[]');
        setSelectedProducts(products);
    }, []);

    const handleFormSubmit = (values: PaymentInfo) => {
        setPaymentInfo(values);
        setShowForm(false);
    };

    const handlePaymentMethodChange = (method: string) => {
        console.log('Selected payment method:', method);
    };

    const handlePlaceOrder = () => {
        console.log('Place order clicked');
        // Implement order placement logic here 
    };

    const handleChangeInfo = () => {
        setShowForm(true);
    };

    return (
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
    );
};

export default PaymentPage;