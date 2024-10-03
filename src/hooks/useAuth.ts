import { useState, useEffect } from 'react';
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

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
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
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            router.push('/');
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Invalid email or password' };
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
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to update profile' };
        }
    }

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return { user, loading, login, logout, updateProfile };
};