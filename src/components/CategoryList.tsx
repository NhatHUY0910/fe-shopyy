'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    imageUrl: string;
}

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/categories');
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const visibleCategories = categories.slice(startIndex, startIndex + itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="relative">
                <div className="overflow-hidden">
                    <div className="flex gap-4">
                        {visibleCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products/category/${category.id}`}
                                className="w-1/5 min-w-[150px] group"
                            >
                                <div className="flex flex-col items-center p-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                                    <div className="relative w-16 h-16 mb-2">
                                        <Image
                                            src={category.imageUrl || '/placeholder-image.png'}
                                            alt={category.name}
                                            fill
                                            className="object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 text-center line-clamp-2 group-hover:text-orange-500 transition-colors duration-300">
                    {category.name}
                  </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {currentPage > 0 && (
                    <button
                        onClick={prevPage}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-300"
                        aria-label="Previous categories"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                )}

                {currentPage < totalPages - 1 && (
                    <button
                        onClick={nextPage}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-300"
                        aria-label="Next categories"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CategoryList;
