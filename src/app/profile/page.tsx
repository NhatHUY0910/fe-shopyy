'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import Sidebar from '@/components/SidebarProfile';
import ProfileForm from '@/components/ProfileForm';

export default function ProfilePage() {
    const { user, loading, checkAuthStatus } = useAuthContext();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            await checkAuthStatus(); // Kiểm tra trạng thái xác thực
            const token = localStorage.getItem('token');
            if (!loading && (!user || !token)) {
                router.push('/login');
            }
            setIsChecking(false);
        };

        checkAuth();
    }, [user, loading, router, checkAuthStatus]);

    if (loading || isChecking) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-semibold mb-6">Hồ Sơ Của Tôi</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                    <ProfileForm />
                </div>
            </div>
        </div>
    );
}
