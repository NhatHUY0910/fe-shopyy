import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Upload, Select, Space, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;

interface UpdateProductFormProps {
    product: any; // Thông tin sản phẩm hiện tại
    onFinish: (values: any) => Promise<void>;
    onCancel: () => void;
}

interface ColorOption {
    id?: number;
    name: string;
    imageFile?: File;
    imageUrl?: string;
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({product, onFinish, onCancel}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([]);
    const [colorPreviews, setColorPreviews] = useState<{[key: number]: string}>({});

    // Khởi tạo fileList từ imageUrls của sản phẩm
    useEffect(() => {
        if (product?.imageUrls) {
            const initialFileList = product.imageUrls.map((url: string, index: number) => ({
                uid: `-${index}`,
                name: `image-${index}`,
                status: 'done',
                url: url,
            }));
            setFileList(initialFileList);
        }

        // Khởi tạo form với dữ liệu sản phẩm
        form.setFieldsValue({
            name: product?.name,
            price: product?.price,
            stockQuantity: product?.stockQuantity,
            description: product?.description,
            producer: product?.producer,
            categoryId: product?.category?.id,
            colors: product?.colors?.map((color: any) => ({
                id: color.id,
                name: color.name,
                imageUrl: color.imageUrl
            })) || [],
            availableSizes: product?.availableSizes || [],
            availableWeights: product?.availableWeights || [],
        });

        // Khởi tạo color previews
        if (product?.colors) {
            const initialColorPreviews = product.colors.reduce((acc: any, color: any, index: number) => ({
                ...acc,
                [index]: color.imageUrl
            }), {});
            setColorPreviews(initialColorPreviews);
        }

        fetchCategories();
    }, [product, form]);

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

    const handleColorImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const preview = await getBase64(file);
            setColorPreviews(prev => ({...prev, [index]: preview}));

            const colors = form.getFieldValue('colors') || [];
            colors[index] = { ...colors[index], imageFile: file };
            form.setFieldsValue({ colors });
        }
    };

    const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
    };

    const handleFinish = async (values: any) => {
        try {
            const formData = new FormData();

            // Append các trường cơ bản
            Object.keys(values).forEach(key => {
                if (key !== 'imageFiles' && key !== 'colors' &&
                    key !== 'availableSizes' && key !== 'availableWeights') {
                    formData.append(key, values[key]);
                }
            });

            // Append các file ảnh mới
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append(`imageFiles`, file.originFileObj);
                }
            });

            // Append existing image URLs
            const existingImageUrls = fileList
                .filter(file => file.url)
                .map(file => file.url);
            existingImageUrls.forEach(url => {
                formData.append('existingImageUrls', url || '');
            });

            // Append colors
            values.colors?.forEach((color: ColorOption, index: number) => {
                if (color.id) {
                    formData.append(`colors[${index}].id`, color.id.toString());
                }
                formData.append(`colors[${index}].name`, color.name);
                if (color.imageFile) {
                    formData.append(`colors[${index}].imageFile`, color.imageFile);
                }
                // Thêm imageUrl hiện tại nếu không có file mới
                if (!color.imageFile && color.imageUrl) {
                    formData.append(`colors[${index}].imageUrl`, color.imageUrl);
                }
            });

            // Append sizes và weights
            values.availableSizes?.forEach((size: string) => {
                formData.append('availableSizes', size);
            });

            values.availableWeights?.forEach((weight: string) => {
                formData.append('availableWeights', weight);
            });

            await onFinish(formData);
            message.success('Product updated successfully');
        } catch (error) {
            console.error('Error updating product:', error);
            message.error('Failed to update product');
        }
    };

    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

    return (
        <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            initialValues={product}
        >
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

            <Form.Item label="Product Images">
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    multiple
                >
                    {fileList.length >= 5 ? null : <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>}
                </Upload>
            </Form.Item>

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
                <Space>
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default UpdateProductForm;
