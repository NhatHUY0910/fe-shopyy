'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthContext } from '@/context/AuthContext'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"

const UserMenu = () => {
    const { user, logout } = useAuthContext()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleLogout = () => {
        console.log('Tính năng đăng xuất đang được phát triển')
        // Uncomment below when ready to implement logout
        // logout()
    }

    if (!user) {
        return (
            <div className="flex items-center">
                <Link href="/register" className="hover:text-gray-200 mr-2">
                    Đăng ký
                </Link>
                <span className="mx-1">|</span>
                <Link href="/login" className="hover:text-gray-200 ml-2">
                    Đăng nhập
                </Link>
            </div>
        )
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
        >
            <div className="flex items-center cursor-pointer">
                {user.avatarUrl ? (
                    <Image
                        src={user.avatarUrl}
                        alt="User avatar"
                        width={24}
                        height={24}
                        className="rounded-full"
                    />
                ) : (
                    <FontAwesomeIcon icon={faUser} size="lg" />
                )}
                <span className="ml-2 mr-4">
                    {user.username || user.email}
                </span>
            </div>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Thông tin tài khoản
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu