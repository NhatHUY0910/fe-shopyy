import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShopify, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faBell, faCircleQuestion, faGlobe, faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const HeaderPayment: React.FC = () => {
    return (
        <header className="bg-white">
            <div className="bg-[#0866FF] text-white">
                <div className="container mx-auto px-4 py-1 flex justify-between text-sm">
                    <div className="flex items-center">
                        <Link href="#" className="mr-2 hover:text-gray-200">Kênh Người Bán</Link>
                        <span className="mr-2">|</span>
                        <Link href="#" className="mr-2 hover:text-gray-200">Tải ứng dụng</Link>
                        <span className="mr-2">|</span>
                        <span className="mr-2">Kết nối</span>
                        <Link href="#" className="mr-1 hover:text-gray-200">
                            <FontAwesomeIcon icon={faFacebook} size="lg" />
                        </Link>
                        <Link href="#" className="hover:text-gray-200">
                            <FontAwesomeIcon icon={faInstagram} size="lg" />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link href="#" className="flex items-center mr-4 hover:text-gray-200">
                            <FontAwesomeIcon icon={faBell} size="lg" />
                            <span className="ml-1">Thông Báo</span>
                        </Link>
                        <Link href="#" className="flex items-center mr-4 hover:text-gray-200">
                            <FontAwesomeIcon icon={faCircleQuestion} size="lg" />
                            <span className="ml-1">Hỗ Trợ</span>
                        </Link>
                        <div className="flex items-center mr-4 hover:text-gray-200 cursor-pointer">
                            <FontAwesomeIcon icon={faGlobe} size="lg" />
                            <span className="ml-1">Tiếng Việt</span>
                            <FontAwesomeIcon icon={faChevronDown} size="sm" className="ml-1" />
                        </div>
                        <div className="flex items-center hover:text-gray-200 cursor-pointer">
                            <FontAwesomeIcon icon={faUser} size="lg" />
                            <span className="ml-1">User Name</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-3 flex items-center">
                <Link href="/" className="flex items-center">
                    <FontAwesomeIcon icon={faShopify} className="text-[#0866FF] text-4xl mr-2" />
                    <span className="text-2xl font-bold text-[#0866FF]">Shopyy</span>
                </Link>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-xl text-[#0866FF]">Thanh Toán</span>
            </div>
        </header>
    );
};

export default HeaderPayment;