'use client'

import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShopify, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { faBell, faCircleQuestion, faGlobe, faSearch, faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons"

const HeaderCart = () => {
    return (
        <header className="bg-[#0866FF] text-white">
            <div className="container mx-auto px-4 py-1 flex justify-between text-sm">
                <div className="flex items-center">
                    <a href="#" className="mr-2 hover:text-gray-200">Kênh Người Bán</a>
                    <span className="mr-2">|</span>
                    <a href="#" className="mr-2 hover:text-gray-200">Trở Thành Người Bán Shopyy</a>
                    <span className="mr-2">|</span>
                    <a href="#" className="mr-2 hover:text-gray-200">Tải ứng dụng</a>
                    <span className="mr-2">|</span>
                    <span className="mr-2">Kết Nối</span>
                    <a href="#" className="mr-1 hover:text-gray-200"><FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon></a>
                    <a href="#" className="hover:text-gray-200"><FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon></a>
                </div>
                <div className="flex items-center">
                    <a href="#" className="flex items-center mr-4 hover:text-gray-200">
                        <FontAwesomeIcon icon={faBell}/>
                        <span className="ml-2">Thông Báo</span>
                    </a>
                    <a href="#" className="flex items-center mr-4 hover:text-gray-200">
                        <FontAwesomeIcon icon={faCircleQuestion}/>
                        <span className="ml-2">Hỗ Trợ</span>
                    </a>
                    <a href="#" className="flex items-center mr-4 hover:text-gray-200">
                        <FontAwesomeIcon icon={faGlobe}/>
                        <span className="ml-2">Tiếng Việt</span>
                    </a>
                    <a href="user.html" className="flex items-center hover:text-gray-200">
                        <FontAwesomeIcon icon={faUser}/>
                        <span className="ml-2">user_name</span>
                    </a>
                </div>
            </div>

            <div className="container mx-auto px-4 py-2 flex items-center">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <FontAwesomeIcon icon={faShopify} size="2xl"/>
                        <span className="text-2xl font-bold">Shopyy</span>
                    </Link>
                    <span className="mx-4 text-2xl text-2xl">|</span>
                    <span className="text-2xl font-bold">Giỏ Hàng</span>
                </div>

                <div className="flex-grow mx-6 .block">
                    <form className="relative w-96 max-w-2xl float-right">
                        <input type="text" placeholder="SALE SỐC MUA LÀ CÓ QUÀ"
                               className="w-full py-2 pl-3 pr-10 text-black rounded-sm focus:outline-none ml-auto"/>
                        <button type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 top-0 h-8 bg-[#0555c9] text-white px-6 hover:bg-[#0444a3] rounded-r-sm">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                </div>
            </div>
        </header>
    )
}

export default HeaderCart