'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';

const ErrorPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Oops!</h1>
                <p className="text-xl mb-8">Bạn chưa có đơn hàng nào.</p>
                <p className="text-lg mb-8">Vui lòng chọn mua ít nhất một sản phẩm trước khi thanh toán.</p>
                <div className="space-x-4">
                    <Button type="primary" size="large" onClick={() => router.push('/')}>
                        Quay lại trang chủ
                    </Button>
                    <Button size="large" onClick={() => router.push('/cart')}>
                        Đến giỏ hàng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;