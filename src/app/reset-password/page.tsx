'use client'

import {useAuthContext} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import Sidebar from "@/components/SidebarProfile";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function ResetPasswordPage() {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-semibold mb-6">Hồ Sơ Của Tôi</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                    <ResetPasswordForm />
                </div>
            </div>
        </div>
    );
} 