import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';

interface PaymentFormProps {
    onSubmit: (values: { fullName: string; phoneNumber: string; address: string }) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        onSubmit(values);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Thông tin thanh toán</h2>
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default PaymentForm;