'use client';

import { Category } from '../app/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const handleCategoryClick = (categoryId: number | null) => {
    onCategoryChange(categoryId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-lg mb-4">CATEGORIES</h3>
      <div className="space-y-2">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === null
              ? 'bg-blue-100 text-blue-700 font-semibold'
              : 'hover:bg-gray-100'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
