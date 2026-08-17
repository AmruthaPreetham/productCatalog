'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import RelatedProducts from '@/components/RelatedProducts';
import { getProductById, getProducts } from '@/lib/api';
import { Product } from '@/app/types';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/login');
      return;
    }

    fetchProduct();
  }, [productId, router]);

  async function fetchProduct() {
    try {
      setLoading(true);
      setError(null);
      
      const products = await getProducts();
      setAllProducts(products);

      const productData = await getProductById(productId);
      
      if (!productData) {
        const foundProduct = products.find(p => p.id.toString() === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found');
        }
      } else {
        setProduct(productData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(`Failed to load product: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (!product) return;
    
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#1e3a8a' }}></div>
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-700 mb-2">
              {error || 'Product Not Found'}
            </h2>
            <p className="text-red-600 mb-6">
              {error ? 'An error occurred while loading the product.' : 'The product you are looking for does not exist.'}
            </p>
            <Link 
              href="/products"
              className="inline-block text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1e3a8a' }}
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/products" className="hover:text-gray-900 transition-colors">
            Products
          </Link>
          <span>{'>'}</span>
          <Link href={`/products?category=${product.categoryId}`} className="hover:text-gray-900 transition-colors">
            {product.category}
          </Link>
          <span>{'>'}</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="flex items-start">
            <div className="w-full bg-white rounded-lg shadow-md p-6">
              <div className="relative h-96 w-full mb-4">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              
              {product.discount > 0 && (
                <div className="text-center">
                  <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
                    {product.discount}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-4">
              <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</p>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#1e3a8a' }}>
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({Math.floor(Math.random() * 5000) + 1000} reviews)
              </span>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-4">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        Save ₹{(product.originalPrice - product.price).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-semibold">In Stock</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-semibold">Out of Stock</span>
                  </>
                )}
              </div>

              {product.inStock && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-l border-r border-gray-300 py-2 focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white mb-3 transition-all ${
                  product.inStock 
                    ? 'hover:opacity-90 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ backgroundColor: product.inStock ? '#1e3a8a' : '#9ca3af' }}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {addedToCart && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center font-semibold">
                  ✓ Added to cart successfully!
                </div>
              )}

              <button className="w-full py-3 px-6 rounded-lg font-semibold border-2 transition-colors" style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a' }}>
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {product.description}
            </p>
            
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1e3a8a' }}>
              Product Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Product ID</span>
                <span className="font-semibold text-gray-900">#{product.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Category</span>
                <span className="font-semibold text-gray-900">{product.category}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Availability</span>
                <span className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1e3a8a' }}>
              Key Highlights
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Premium Quality Product</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Fast Shipping Available</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Easy Returns</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Genuine Product Guarantee</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1e3a8a' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2" style={{ color: '#1e3a8a' }}>Delivery Info</h4>
            <p className="text-sm text-gray-600">Free Delivery</p>
            <p className="text-sm text-gray-600">Ships in 2-3 days</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1e3a8a' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2" style={{ color: '#1e3a8a' }}>Return Policy</h4>
            <p className="text-sm text-gray-600">Easy Returns</p>
            <p className="text-sm text-gray-600">30-day return window</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1e3a8a' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2" style={{ color: '#1e3a8a' }}>Best Price</h4>
            <p className="text-sm text-gray-600">Price Match Guarantee</p>
            <p className="text-sm text-gray-600">Lowest price available</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1e3a8a' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2" style={{ color: '#1e3a8a' }}>Quality Assurance</h4>
            <p className="text-sm text-gray-600">Genuine Product</p>
            <p className="text-sm text-gray-600">Guarantee</p>
          </div>
        </div>

        {allProducts.length > 0 && product && (
          <RelatedProducts 
            products={allProducts} 
            currentProductId={product.id}
            categoryId={product.categoryId}
            limit={4}
          />
        )}

        <div className="mt-12 text-center">
          <Link 
            href="/products"
            className="inline-block text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1e3a8a' }}
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
