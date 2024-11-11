'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import CartContent from '@/components/CartContent';
import HeaderCart from "@/components/HeaderCart";

export default function CartPage() {
    const router = useRouter();
    const { user, loading } = useAuthContext();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null
    }

    return (
        <>
            <HeaderCart />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6">Giỏ Hàng Của Bạn</h1>
                    <CartContent />
                </div>
            </div>
        </>
    );
}
