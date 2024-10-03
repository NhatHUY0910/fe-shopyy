import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface UserProfile {
    username: string;
    email: string;
    avatarUrl: string;
}

const ProfileForm: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile>({
        username: '',
        email: '',
        avatarUrl: '/placeholder-avatar.png',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                username: user.username || '',
                email: user.email || '',
                avatarUrl: user.avatarUrl || '/placeholder-avatar.png',
            });
            setNewUsername(user.username || '');
        }
    }, [user]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setNewAvatarFile(file);
            setIsUploading(true);

            // Create a temporary URL for preview
            const tempUrl = URL.createObjectURL(file);
            setTempAvatarUrl(tempUrl);

            // Simulate upload delay
            setTimeout(() => {
                setIsUploading(false);
            }, 1000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        if (newUsername !== profile.username) {
            formData.append('username', newUsername);
        }
        if (newAvatarFile) {
            formData.append('avatarFile', newAvatarFile);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setProfile({
                    ...profile,
                    username: updatedUser.username,
                    avatarUrl: updatedUser.avatarUrl,
                });
                setTempAvatarUrl(null);
                setNewAvatarFile(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewUsername(profile.username);
        setTempAvatarUrl(null);
        setNewAvatarFile(null);
    };

    const displayAvatarUrl = tempAvatarUrl || profile.avatarUrl;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Hồ Sơ Của Tôi</h2>
            <div className="flex">
                <div className="w-2/3 pr-8">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label className="w-32 text-gray-600">Email</label>
                            <span className="text-gray-800">{profile.email}</span>
                        </div>
                        <div className="flex items-center">
                            <label className="w-32 text-gray-600">Tên</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="border rounded px-2 py-1"
                                />
                            ) : (
                                <span className="text-gray-800">{profile.username || 'Chưa cập nhật'}</span>
                            )}
                        </div>
                    </div>
                    {isEditing ? (
                        <div className="mt-6 space-x-4">
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                            >
                                Lưu
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Hủy
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-6 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                            Sửa hồ sơ
                        </button>
                    )}
                </div>
                <div className="w-1/3">
                    <div className="text-center">
                        <div className="mb-4 relative w-24 h-24 mx-auto">
                            {isUploading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full">
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                                </div>
                            ) : (
                                <Image
                                    src={displayAvatarUrl}
                                    alt="Avatar"
                                    fill
                                    className="rounded-full object-cover"
                                    sizes="(max-width: 96px) 100vw, 96px"
                                />
                            )}
                        </div>
                        {isEditing && (
                            <div>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="avatar-upload"
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`cursor-pointer ${
                                        isUploading ? 'text-gray-500' : 'text-orange-500 hover:text-orange-600'
                                    }`}
                                >
                                    {isUploading ? 'Đang tải...' : 'Chọn ảnh'}
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
