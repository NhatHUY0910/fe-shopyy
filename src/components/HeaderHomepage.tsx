'use client'

import {useRouter} from "next/navigation";
import Link from "next/link"
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fab, faFacebook, faInstagram, faShopify} from "@fortawesome/free-brands-svg-icons";
import {faBell, faCircleQuestion, faGlobe, faSearch, faShoppingCart, faUser, faSignOutAlt, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "@/hooks/useAuth";
import {debounce} from "lodash";

interface SearchSuggestion {
    suggestions: string[];
    loading: boolean;
}

const HeaderHomepage = () => {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion>({
        suggestions: [],
        loading: false
    });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Debounced function for API calls
    const debouncedFetchSuggestions = useRef(
        debounce(async (keyword: string) => {
            if (!keyword.trim()) {
                setSearchSuggestions({ suggestions: [], loading: false });
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/api/products/suggestions?keyword=${encodeURIComponent(keyword)}`
                );
                if (!response.ok) throw new Error('Failed to fetch suggestions');
                const suggestions = await response.json();
                setSearchSuggestions({
                    suggestions,
                    loading: false
                });
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSearchSuggestions({
                    suggestions: [],
                    loading: false
                });
            }
        }, 300)
    ).current;

    // Handle input change
    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSearchSuggestions(prev => ({ ...prev, loading: true }));
        debouncedFetchSuggestions(value);
    };

    // Handle search submission
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        // Hide suggestions
        setShowSuggestions(false);

        // Navigate to search results page
        router.push(`/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        router.push(`/search?keyword=${encodeURIComponent(suggestion)}`);
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        console.log("Logout functionality will be implemented later");
    };

    const handleProfileClick = () => {
        router.push('/profile');
    };

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

                        {user ? (
                            <div className="relative group">
                                <div className="flex items-center mr-4 hover:text-gray-200 cursor-pointer">
                                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                                        <Image
                                            src={user.avatarUrl || '/placeholder-image.png'}
                                            alt="User avatar"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 32px) 100vw, 32px"
                                        />
                                    </div>
                                    <span className="mr-2 ml-2">{user.username || user.email}</span>
                                </div>
                                {/* Thêm một div "cầu nối" vô hình */}
                                <div className="absolute top-full left-0 w-full h-2"></div>
                                {/* Điều chỉnh vị trí của dropdown menu */}
                                <div className="absolute right-0 top-[calc(100%+2px)] w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                                    <div className="py-1">
                                        <button
                                            onClick={handleProfileClick}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                                            Thông tin tài khoản
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <Link href="/register" className="mr-2 hover:text-gray-200">Đăng ký</Link>
                                <span className="mr-2">|</span>
                                <Link href="/login" className="hover:text-gray-200">Đăng nhập</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                <div className="flex items-center w-1/4">
                    <Link href="/" className="flex items-center">
                        <FontAwesomeIcon icon={faShopify} size="4x" />
                        <span className="text-2xl font-bold">Shopyy</span>
                    </Link>
                </div>

                <div className="w-[1500px]" ref={searchContainerRef}>
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchInput}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="SALE SỐC MUA LÀ CÓ QUÀ"
                            className="w-full py-2 pl-3 pr-10 text-black rounded-sm focus:outline-none"/>
                        <button
                            type="submit"
                            aria-label="Search"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 top-0 h-8 bg-[#0555c9] text-white px-6 hover:bg-[#0444a3] rounded-r-sm">
                            <FontAwesomeIcon icon={faSearch} size="sm"/>
                        </button>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && (searchSuggestions.loading || searchSuggestions.suggestions.length > 0) && (
                            <div className="absolute w-full bg-white mt-1 rounded-sm shadow-lg z-50 max-h-80 overflow-y-auto">
                                {searchSuggestions.loading ? (
                                    <div className="p-3 text-gray-500">Đang tìm kiếm...</div>
                                ) : (
                                    searchSuggestions.suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="p-3 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                                        >
                                            <FontAwesomeIcon icon={faSearch} className="mr-2 text-gray-400" size="sm" />
                                            <span>{suggestion}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </form>
                </div>

                <div className="flex items-center justify-end w-1/4">
                    <Link href="/cart" className="mr-20">
                        <FontAwesomeIcon icon={faShoppingCart} size="2xl"></FontAwesomeIcon>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-2 text-sm justify-end">
                <div className="ml-60">
                    <Link href="#" className="mr-4 hover:text-gray-200">Laptop gaming</Link>
                    <Link href="#" className="mr-4 hover:text-gray-200">Quần áo Châu Âu</Link>
                    <Link href="#" className="mr-4 hover:text-gray-200">Combo bàn phím + chuột</Link>
                    <Link href="#" className="mr-4 hover:text-gray-200">Điện thoại Samsung</Link>
                    <Link href="#" className="mr-4 hover:text-gray-200">Xe đạp thể thao</Link>
                    <Link href="#" className="mr-4 hover:text-gray-200">Giày sneaker</Link>
                    <Link href="#" className="mr-4 hover:text-gray-200">Tai nghe bluetooth</Link>
                    <Link href="#" className="mr-4 hover:text-gray-200">Máy cạo râu</Link>
                </div>
            </div>
        </header>
    )
}

export default HeaderHomepage
