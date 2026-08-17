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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-6 uppercase tracking-wide" style={{ color: '#1e3a8a' }}>
        {TEXT.CATEGORIES.TITLE}
      </h3>
      <div className="space-y-3">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-semibold ${
            selectedCategory === null
              ? 'text-white shadow-lg'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          style={{
            backgroundColor: selectedCategory === null ? '#1e3a8a' : 'transparent'
          }}
        >
          {TEXT.CATEGORIES.ALL_CATEGORIES}
        </button>
        {categories.map((category) => {
          const isSelected = Number(selectedCategory) === Number(category.id);          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-semibold ${
                isSelected
                  ? 'text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: isSelected ? '#1e3a8a' : 'transparent'
              }}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
