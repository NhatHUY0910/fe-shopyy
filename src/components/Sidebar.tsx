import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HomeOutlined, UserOutlined, ShoppingOutlined, BellOutlined, WalletOutlined } from '@ant-design/icons';

const ProfileSidebar: React.FC = () => {
    const router = useRouter();

    const menuItems = [
        { icon: <HomeOutlined />, text: 'Trang chủ', path: '/' },
        { icon: <UserOutlined />, text: 'Thông tin cá nhân', path: '/profile' },
        { icon: <ShoppingOutlined />, text: 'Đơn mua', path: '#' },
        { icon: <BellOutlined />, text: 'Thông báo', path: '#' },
        { icon: <WalletOutlined />, text: 'Ví của tôi', path: '#' },
    ];

    const handleClick = (path: string) => {
        if (path === '#') {
            console.log('Tính năng đang được phát triển');
            return;
        }
        router.push(path);
    };

    return (
        <div className="w-64 bg-white p-4">
            <div className="space-y-4">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleClick(item.path)}
                        className={`flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded ${
                            item.text === 'Thông tin cá nhân' ? 'text-orange-500' : 'text-gray-700'
                        }`}
                    >
                        {item.icon}
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileSidebar;