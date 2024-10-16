import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { message, Form, Input, InputNumber, Button, Upload, Select, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { storage } from '@/config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { Option } = Select;

interface CreateProductFormProps {
    onFinish: (values: any) => Promise<void>;
}

interface ColorOption {
    name: string;
    imageFile?: File;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({ onFinish }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [colorPreviews, setColorPreviews] = useState<{[key: number]: string}>({});

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

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
    };

    // Xử lý preview cho color image
    const handleColorImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const preview = await getBase64(file);
            setColorPreviews(prev => ({...prev, [index]: preview}));

            // Cập nhật form field
            const colors = form.getFieldValue('colors') || [];
            colors[index] = { ...colors[index], imageFile: file };
            form.setFieldsValue({ colors });
        }
    };

    const handleFinish = async (values: any) => {
        if (!values.name || !values.price || !values.stockQuantity || !values.categoryId) {
            message.error('Please fill all required fields');
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (key !== 'imageFiles' && key !== 'colors' && key !== 'availableSizes' && key !== 'availableWeights') {
                    formData.append(key, values[key]);
                }
            });

            // Append product images
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append(`imageFiles`, file.originFileObj);
                }
            });

            // Append colors
            values.colors?.forEach((color: ColorOption, index: number) => {
                formData.append(`colors[${index}].name`, color.name);
                if (color.imageFile) {
                    formData.append(`colors[${index}].imageFile`, color.imageFile);
                }
            });

            // Append sizes
            values.availableSizes?.forEach((size: string) => {
                formData.append('availableSizes', size);
            });

            // Append weights
            values.availableWeights?.forEach((weight: string) => {
                formData.append('availableWeights', weight);
            });

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

            const newProduct = await response.json();
            await onFinish(newProduct);

            form.resetFields();
            setFileList([]);
            setColorPreviews({});
            message.success('Product created successfully');
        } catch (error) {
            console.error('Error creating product:', error);
            message.error('Failed to create product');
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

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

            {/* Product Images */}
            <Form.Item label="Product Images">
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    multiple
                >
                    {fileList.length >= 5 ? null : uploadButton}
                </Upload>
            </Form.Item>

            {/* Colors */}
            <Form.List name="colors">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, index) => (
                            <Space key={field.key} align="baseline">
                                <Form.Item
                                    {...field}
                                    label={index === 0 ? "Colors" : ""}
                                    required={false}
                                    name={[field.name, 'name']}
                                >
                                    <Input placeholder="Color name" style={{ width: '200px' }} />
                                </Form.Item>
                                <Form.Item label={index === 0 ? "Color Image" : ""}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleColorImageChange(e, index)}
                                    />
                                    {colorPreviews[index] && (
                                        <img
                                            src={colorPreviews[index]}
                                            alt={`Color preview ${index}`}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginTop: '8px' }}
                                        />
                                    )}
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Color
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            {/* Sizes */}
            <Form.List name="availableSizes">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, index) => (
                            <Space key={field.key} align="baseline">
                                <Form.Item
                                    {...field}
                                    label={index === 0 ? "Sizes" : ""}
                                    required={false}
                                >
                                    <Input placeholder="Size (e.g., S, M, L, XL)" style={{ width: '200px' }} />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Size
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            {/* Weights */}
            <Form.List name="availableWeights">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, index) => (
                            <Space key={field.key} align="baseline">
                                <Form.Item
                                    {...field}
                                    label={index === 0 ? "Weights" : ""}
                                    required={false}
                                >
                                    <Input placeholder="Weight (e.g., 500g, 1kg)" style={{ width: '200px' }} />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Weight
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Create Product
                </Button>
            </Form.Item>
        </Form>
    );
};

const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

export default CreateProductForm;
