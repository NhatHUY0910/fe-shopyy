import React, {useState} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {useAuthContext} from "@/context/AuthContext";
import { HomeOutlined, UserOutlined, ShoppingOutlined, BellOutlined, WalletOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { Modal } from 'antd'

const ProfileSidebar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuthContext();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const menuItems = [
        { icon: <HomeOutlined />, text: 'Trang chủ', path: '/' },
        { icon: <UserOutlined />, text: 'Thông tin cá nhân', path: '/profile' },
        { icon: <LockOutlined />, text: 'Quên mật khẩu', path: '/reset-password' },
        { icon: <ShoppingOutlined />, text: 'Đơn mua', path: '#' },
        { icon: <BellOutlined />, text: 'Thông báo', path: '#' },
        { icon: <WalletOutlined />, text: 'Ví của tôi', path: '#' },
        { icon: <LogoutOutlined />, text: 'Đăng xuất', path: 'logout' }
    ];

    const handleClick = async (path: string) => {
        if (path === '#') {
            console.log('Tính năng đang được phát triển');
            return;
        }
        if (path === 'logout') {
            setIsLogoutModalOpen(true);
            return;
        }
        router.push(path);
    };

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            setIsLogoutModalOpen(false);
        } else {
            // Có thể thêm thông báo lỗi ở đây nếu cần
            console.error('Logout failed:', result.error);
        }
    };

    return (
        <>
            <div className="w-64 bg-white p-4">
                <div className="space-y-4">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleClick(item.path)}
                            className={`flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded ${
                                pathname === item.path ? 'text-[#0866FF]' : 'text-gray-700'
                            }`}
                        >
                            {item.icon}
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                title="Xác nhận đăng xuất"
                open={isLogoutModalOpen}
                onOk={handleLogout}
                onCancel={() => setIsLogoutModalOpen(false)}
                okText="Đăng xuất"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn đăng xuất không?</p>
            </Modal>
        </>
    );
};

export default ProfileSidebar;
