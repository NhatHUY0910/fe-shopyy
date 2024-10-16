import { useState } from 'react';

interface Color {
    id: string;
    name: string;
    imageUrl: string;
}

interface ProductColorSelectorProps {
    colors: Color[];
    selectedColor: Color | null;
    onColorSelect: (color: Color) => void;
}

const ProductColorSelector: React.FC<ProductColorSelectorProps> = ({ colors, selectedColor, onColorSelect }) => {
    const [hoveredColor, setHoveredColor] = useState<Color | null>(null);

    return (
        <div className="mb-4">
            <p className="font-bold mb-2">Màu Sắc</p>
            <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                    <button
                        key={color.id}
                        className={`relative flex items-center p-2 border rounded-lg hover:border-blue-500 transition-all ${
                            selectedColor?.id === color.id ? 'border-blue-500' : 'border-gray-300'
                        }`}
                        onClick={() => onColorSelect(color)}
                        onMouseEnter={() => setHoveredColor(color)}
                        onMouseLeave={() => setHoveredColor(null)}
                    >
                        <div className="flex items-center space-x-2">
                            <div className="relative w-10 h-10 rounded-md overflow-hidden">
                                <img
                                    src={color.imageUrl}
                                    alt={color.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-sm">{color.name}</span>
                        </div>
                        {hoveredColor?.id === color.id && (
                            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                                    <img
                                        src={color.imageUrl}
                                        alt={color.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductColorSelector;
