'use client';

import { Category } from '../app/types';
import { TEXT } from '@/lib/text-constants';

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
      <h3 className="font-bold text-lg mb-4">{TEXT.CATEGORIES.TITLE}</h3>
      <div className="space-y-2">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === null
              ? 'font-semibold'
              : 'hover:bg-gray-100'
          }`}
          style={{
            backgroundColor: selectedCategory === null ? '#1e3a8a' : 'transparent',
            color: selectedCategory === null ? '#ffffff' : '#000000'
          }}
        >
          {TEXT.CATEGORIES.ALL_CATEGORIES}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'font-semibold'
                : 'hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: selectedCategory === category.id ? '#1e3a8a' : 'transparent',
              color: selectedCategory === category.id ? '#ffffff' : '#000000'
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
