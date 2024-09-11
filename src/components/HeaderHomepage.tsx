import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faShopify } from "@fortawesome/free-brands-svg-icons";
import { faBell, faCircleQuestion, faGlobe, faSearch, faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";

const HeaderHomepage = () => {
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
                            <FontAwesomeIcon icon={faBell} size="lg" />
                            <span className="mr-2 ml-2">Thông Báo</span>
                        </Link>
                        <Link href="#" className="flex items-center mr-4 hover:text-gray-200">
                            <FontAwesomeIcon icon={faCircleQuestion} size="lg" />
                            <span className="mr-2 ml-2">Hỗ Trợ</span>
                        </Link>
                        <Link href="#" className="flex items-center mr-4 hover:text-gray-200">
                            <FontAwesomeIcon icon={faGlobe} size="lg" />
                            <span className="mr-2 ml-2">Tiếng Việt</span>
                        </Link>
                        <Link href="#" className="flex items-center mr-4 hover:text-gray-200">
                            <FontAwesomeIcon icon={faUser} size="lg" />
                            <span className="fas mr-2 ml-2">User Name</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-2 flex items-center">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <FontAwesomeIcon icon={faShopify} size="4x" />
                        <span className="text-2xl font-bold">Shopyy</span>
                    </Link>
                </div>
                <div className="flex-grow mx-4">
                    <form className="relative">
                        <input type="text"
                               placeholder="SALE SỐC MUA LÀ CÓ QUÀ"
                               className="w-full py-2 pl-3 pr-10 text-black rounded-sm focus:outline-none" />
                        <button type="submit"
                                aria-label="Search"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 top-0 h-8 bg-[#0555c9] text-white px-6 hover:bg-[#0444a3] rounded-r-sm">
                            <FontAwesomeIcon icon={faSearch} size="sm" />
                        </button>
                    </form>
                </div>
                <div className="flex items-center">
                    <Link href="/cart" className="mr-4">
                        <FontAwesomeIcon icon={faShoppingCart} size="2xl" />
                    </Link>
                </div>
            </div>
            <div className="container mx-auto px-4 py-2 text-sm">
                <Link href="#" className="mr-4 hover:text-gray-200">Trang Phục Quý Tộc</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Quần Áo Châu Âu</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Quần Áo Châu Á</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Trang Phục Truyền Thống</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Quần Áo Cách Tân</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Quần Áo Thời Trang Theo Xu Hướng</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Trang Phục Cosplay</Link>
                <Link href="#" className="mr-4 hover:text-gray-200">Nhà Thiết Kế Nổi Tiếng</Link>
            </div>
        </header>
    );
};

export default HeaderHomepage;