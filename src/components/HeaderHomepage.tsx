'use client'

import {useRouter} from "next/navigation";
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fab, faFacebook, faInstagram, faShopify} from "@fortawesome/free-brands-svg-icons";
import {faBell, faCircleQuestion, faGlobe, faSearch, faShoppingCart, faUser} from "@fortawesome/free-solid-svg-icons";

const HeaderHomepage = () => {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
    }

    return (
        <header className="bg-[#0866FF] text-white">
            <div className="bg-[#0866FF] text-white">
                <div className="container mx-auto px-4 py-1 flex justify-between text-sm">
                    <div className="flex items-center">
                        <Link href="#" className="mr-2 hover:text-gray-200">Kênh Người Bán</Link>
                        <span className="mr-2">|</span>
                        <Link href="#" className="mr-2 hover:text-gray-200">Trở Thành Người Bán Shopyy</Link>
                        <span className="mr-2">|</span>
                        <Link href="#" className="mr-2 hover:text-gray-200">Tải ứng dụng</Link>
                        <span className="mr-2">|</span>
                        <span className="mr-2">Kết Nối</span>
                        <Link href="#" className="mr-1 hover:text-gray-200">
                            <FontAwesomeIcon icon={faFacebook} size="lg" />
                        </Link>
                        <Link href="#" className="hover:text-gray-200">
                            <FontAwesomeIcon icon={faInstagram} size="lg" />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link href="#" className="flex items-center mr-4 hover:text-gray-200">
                            <FontAwesomeIcon icon={faBell} size="lg"></FontAwesomeIcon>
                            <span className="mr-2 ml-2">Thông Báo</span>
                        </Link>
                        <Link href="#" className="flex items-center mr-4 hover:text-gray-200">
                            <FontAwesomeIcon icon={faCircleQuestion} size="lg"></FontAwesomeIcon>
                            <span className="mr-2 ml-2">Hỗ Trợ</span>
                        </Link>
                        <Link href="#" className="flex items-center mr-4 hover:text-gray-200">
                            <FontAwesomeIcon icon={faGlobe} size="lg"></FontAwesomeIcon>
                            <span className="mr-2 ml-2">Tiếng Việt</span>
                        </Link>
                        <Link href="#" className="flex items-center mr-4 hover:text-gray-200">
                            <FontAwesomeIcon icon={faUser} size="lg"></FontAwesomeIcon>
                            <span className="fas mr-2 ml-2">User Name</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-2 flex items-center">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <FontAwesomeIcon icon={faShopify} size="4x"></FontAwesomeIcon>
                        <span className="text-2xl font-bold">Shopyy</span>
                    </Link>
                </div>

                <div className="flex-grow mx-4">
                    <form className="relative">
                        <input
                            type="text"
                            placeholder="SALE SỐC MUA LÀ CÓ QUÀ"
                            className="w-full py-2 pl-3 pr-10 text-black rounded-sm focus:outline-none" />
                        <button
                            type="submit"
                            aria-label="Search"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 top-0 h-8 bg-[#0555c9] text-white px-6 hover:bg-[#0444a3] rounded-r-sm">
                            <FontAwesomeIcon icon={faSearch} size="sm" />
                        </button>
                    </form>
                </div>

                <div className="flex items-center">
                    <Link href="/cart" className="mr-4">
                        <FontAwesomeIcon icon={faShoppingCart} size="2xl"></FontAwesomeIcon>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-2 text-sm">
                <Link href="#" className="mr-4 hover:text-gray-200">Laptop gaming</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Quần áo Châu Âu</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Combo bàn phím + chuột</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Điện thoại Samsung</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Xe đạp thể thao</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Giày sneaker</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Tai nghe bluetooth</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Máy cạo râu</Link>
            </div>
        </header>
    )
}

export default HeaderHomepage