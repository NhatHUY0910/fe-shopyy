import axios from 'axios';

interface OrderData {
    fullName: string;
    phoneNumber: string;
    address: string;
    paymentMethod: string;
    orderItems: Array<{ productId: number; quantity: number }>;
}

interface OrderResponse {
    id: number;
    paymentUrl?: string;
    // ... other fields
}

export const createOrder = async (orderData: OrderData): Promise<OrderResponse> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post<OrderResponse>('http://localhost:8080/api/orders', orderData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};
