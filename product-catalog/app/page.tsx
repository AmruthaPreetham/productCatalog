'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import Header from '@/components/Header';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category } from '../app/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(`Failed to load products: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(product => {
  
    if (selectedCategory !== null) {
      const productCategoryId = Number(product.categoryId);
      const selectedCategoryId = Number(selectedCategory);
      if (productCategoryId !== selectedCategoryId) return false;
    }

   
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.category && product.category.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    return true;
  });


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-600 mb-4">
              Please make sure JSON Server is running. Open a new terminal and run:
            </p>
            <code className="bg-gray-800 text-white px-4 py-2 rounded block mb-4">
              npx json-server db.json --port 5000
            </code>
            <button 
              onClick={fetchData}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} initialSearchQuery={searchQuery} />

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Mega Save On Top Brands</h1>
            <p className="text-xl mb-6">Up to 60% Off</p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now →
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </aside>

          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-4">
                  <label className="text-gray-700 font-medium">Sort by:</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
                {selectedCategory && (
                  <div className="text-sm text-gray-600">
                    Showing products in: <span className="font-semibold text-blue-600">
                      {categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 font-medium">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="bg-gray-300 h-64 rounded-md mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">
                  {searchQuery.trim()
                    ? `No products found matching "${searchQuery}".`
                    : selectedCategory 
                    ? `No products found in ${categories.find(c => c.id === selectedCategory)?.name}.`
                    : 'No products found.'}
                </p>
                {(searchQuery.trim() || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
