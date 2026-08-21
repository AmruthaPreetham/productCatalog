'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import Header from '@/components/Header';
import Pagination from '@/components/Pagination';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category } from '@/app/types';

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
const handleLogout = () => {
  // Remove logged-in user data
  localStorage.removeItem("user");

  // Clear any session data
  sessionStorage.clear();

  // Redirect to login page
  router.replace("/login");
};
  //const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.replace("/login");
      return;
    }

    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryId = Number(categoryParam);
      setSelectedCategory(categoryId);
    }

    fetchData();
  }, [router, searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, searchQuery]);

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

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

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
              className="text-white px-6 py-2 rounded-lg hover:opacity-90"
              style={{ backgroundColor: '#1e3a8a' }}
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
<div className="flex justify-end p-4">

</div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <CategoryFilter 
              key={selectedCategory}
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
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#1e3a8a' } as React.CSSProperties}
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
                    Showing products in: <span className="font-semibold" style={{ color: '#1e3a8a' }}>
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
                    className="text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: '#1e3a8a' }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
