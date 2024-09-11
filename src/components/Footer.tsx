import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-600 mt-8">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div>
                        <h3 className="font-bold mb-4">CHĂM SÓC KHÁCH HÀNG</h3>
                        <ul>
                            <li><Link href="#" className="hover:text-[#0866FF]">Trung Tâm Trợ Giúp</Link></li>
                            <li><Link href="#" className="hover:text-[#0866FF]">Shopyy Blog</Link></li>
                            <li><Link href="#" className="hover:text-[#0866FF]">Shopyy Mall</Link></li>
                            <li><Link href="#" className="hover:text-[#0866FF]">Hướng Dẫn Mua Hàng</Link></li>
                            <li><Link href="#" className="hover:text-[#0866FF]">Thanh Toán</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">VỀ SHOPYY</h3>
                        <ul>
                            <li><Link href="#" className="hover:text-[#0866FF]">Giới Thiệu Về Shopyy Việt Nam</Link></li>
                            <li><Link href="#" className="hover:text-[#0866FF]">Tuyển Dụng</Link></li>
                            <li><Link href="#" className="hover:text-[#0866FF]">Điều Khoản Shopyy</Link></li>
                            <li><Link href="#" className="hover:text-[#0866FF]">Chính Sách Bảo Mật</Link></li>
                            <li><Link href="#" className="hover:text-[#0866FF]">Chính Hãng</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">THANH TOÁN</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <img src="https://down-vn.img.susercontent.com/file/d4bbea4570b93bfd5fc652ca82a262a8" alt="Visa" width={48} height={32} className="object-contain" />
                            <img src="https://down-vn.img.susercontent.com/file/a0a9062ebe19b45c1ae0506f16af5c16" alt="MasterCard" width={48} height={32} className="object-contain" />
                            <img src="https://down-vn.img.susercontent.com/file/38fd98e55806c3b2e4535c4e4a6c4c08" alt="JCB" width={48} height={32} className="object-contain" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">THEO DÕI CHÚNG TÔI TRÊN</h3>
                        <ul>
                            <li><Link href="#" className="hover:text-[#0866FF] mr-2"><FontAwesomeIcon className="mr-2" icon={faFacebook} />Facebook</Link></li>
                            <li><Link href="#" className="hover:text-[#0866FF] mr-2"><FontAwesomeIcon className="mr-2" icon={faInstagram} />Instagram</Link></li>
                            <li><Link href="#" className="hover:text-[#0866FF] mr-2"><FontAwesomeIcon className="mr-2" icon={faLinkedin} />LinkedIn</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">TẢI ỨNG DỤNG SHOPYY NGAY THÔI</h3>
                        <div className="flex">
                            <img src="https://down-vn.img.susercontent.com/file/a5e589e8e118e937dc660f224b9a1472" alt="QR Code" width={96} height={96} className="mr-4" />
                            <div>
                                <img src="https://down-vn.img.susercontent.com/file/ad01628e90ddf248076685f73497c163" alt="App Store" width={128} height={40} className="mb-2" />
                                <img src="https://down-vn.img.susercontent.com/file/ae7dced05f7243d0f3171f786e123def" alt="Google Play" width={128} height={40} className="mb-2" />
                                <img src="https://down-vn.img.susercontent.com/file/35352374f39bdd03b25e7b83542b2cb0" alt="App Gallery" width={128} height={40} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-200 py-4 text-center text-sm">
                © 2024 Công ty trách nhiệm vô hạn Shopyy
            </div>
        </footer>
    );
};

export default Footer;