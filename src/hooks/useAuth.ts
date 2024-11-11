import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    username?: string;
    avatarUrl?: string;
}

interface UpdateUserData {
    username?: string;
    avatarFile?: File;
}

interface AuthResult {
    success: boolean;
    error?: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    const checkAuthStatus = useCallback(async () => {
        if (user && !loading) {
            setIsInitialized(true);
            return true;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            setIsInitialized(true);
            return false;
        }

        try {
            const response = await fetch('http://localhost:8080/api/users/check-auth', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    setUser(data.user);
                    setLoading(false);
                    setIsInitialized(true);
                    return true;
                }
            }

            // Token không hợp lệ hoặc hết hạn
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
            setIsInitialized(true);
            return false;
        } catch (error) {
            console.error('Error checking auth status:', error);
            setUser(null);
            setLoading(false);
            setIsInitialized(true);
            return false;
        }
    }, [user, loading]);

    useEffect(() => {
        if (!isInitialized) {
            checkAuthStatus();
        }
    }, [isInitialized, checkAuthStatus]);

    const login = async (email: string, password: string): Promise<AuthResult> => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            // Đảm bảo dữ liệu được lưu trữ đồng bộ
            await Promise.all([
                localStorage.setItem('token', data.token),
                localStorage.setItem('user', JSON.stringify(data.user))
            ]);

            setUser(data.user);
            setLoading(false);

            // Đợi state được cập nhật
            await new Promise(resolve => setTimeout(resolve, 100));

            router.push('/');
            return { success: true };
        } catch (error) {
            setLoading(false);
            return { success: false, error: 'Invalid email or password' };
        }
    };

    const logout = async (): Promise<AuthResult> => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch('http://localhost:8080/api/users/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Xóa dữ liệu local storage và state đồng thời
            await Promise.all([
                localStorage.removeItem('token'),
                localStorage.removeItem('user')
            ]);

            setUser(null);
            setLoading(false);

            // Đợi state được cập nhật
            await new Promise(resolve => setTimeout(resolve, 3000));

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            router.push('/');
            return { success: true };
        } catch (error) {
            setLoading(false);
            return { success: false, error: 'Logout failed' };
        }
    };

        const updateProfile = async (updateData: UpdateUserData) => {
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();

                if (updateData.username) {
                    formData.append('username', updateData.username);
                }
                if (updateData.avatarFile) {
                    formData.append('avatarFile', updateData.avatarFile);
                }

                const response = await fetch('http://localhost:8080/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                })

                if (!response.ok) {
                    throw new Error('Update failed');
                }

                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                return {success: true};
            } catch (error) {
                return {success: false, error: 'Failed to update profile'};
            }
        }

    return { user, loading, login, logout, checkAuthStatus, isInitialized, };
};
