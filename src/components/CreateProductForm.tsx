import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { message, Form, Input, InputNumber, Button, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { storage } from '@/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { Option } = Select;

interface CreateProductFormProps {
    onFinish: (values: any) => Promise<void>;
}

const CreateProductForm: React.FC<{ onFinish: (values: any) => void }> = ({ onFinish }) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/categories', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Failed to load categories');
        }
    };

    const handleFinish = async (values: any) => {
        if (!values.name || !values.price || !values.stockQuantity) {
            message.error('Please fill all required fields');
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (key !== 'image') {
                    formData.append(key, values[key]);
                }
            });

            if (imageFile) {
                formData.append('imageFile', imageFile, imageFile.name);
            }

            // Send request to create product
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            // Get the newly created product from response
            const newProduct = await response.json();
            await onFinish(newProduct);

            // Reset form state
            form.resetFields();
            setImageFile(null);
            message.success('Product created successfully');
        } catch (error) {
            console.error('Error creating product:', error);
            message.error('Failed to create product');
        }
    };

    const handleImageUpload = (info: any) => {
        const file = info.file.originFileObj;
        setImageFile(file);
        message.success('Image ready for upload');
    };

    return (
        <Form form={form} onFinish={handleFinish} layout="vertical">
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="stockQuantity" label="Stock Quantity" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="description" label="Description">
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="producer" label="Producer">
                <Input />
            </Form.Item>
            <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select a category">
                    {categories.map(category => (
                        <Option key={category.id} value={category.id}>{category.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="image" label="Product Image">
                <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Create Product
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateProductForm;
