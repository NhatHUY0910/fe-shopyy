'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import CartItemList from '@/components/CartItemList';

export default function CartContent() {
    const router = useRouter();
    const { user, loading } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [user, loading, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <CartItemList />;
}