'use client';

import Link from 'next/link';
import { TEXT } from '@/lib/text-constants';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onSearch?: (query: string) => void;
  initialSearchQuery?: string;
}

export default function Header({ onSearch, initialSearchQuery = '' }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
const router = useRouter();

const [user, setUser] = useState<any>(null);

const [showProfileMenu, setShowProfileMenu] =
  useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
const handleLogout = () => {
  localStorage.removeItem("user");
  router.push("/login");
};
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-white p-2 rounded-lg" style={{ backgroundColor: '#1e3a8a' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>{TEXT.APP_NAME}</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder={TEXT.HEADER.SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#1e3a8a' } as React.CSSProperties}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white px-4 py-1 rounded-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1e3a8a' }}
              >
                {TEXT.HEADER.SEARCH_BUTTON}
              </button>
            </div>
          </form>

          <div className="flex items-center gap-6">
            <button className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: '#1e3a8a' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs">{TEXT.HEADER.WISHLIST}</span>
            </button>
            <button className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: '#1e3a8a' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs">{TEXT.HEADER.CART}</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>
            <div className="relative">
              <button
                onClick={() =>
                  setShowProfileMenu(!showProfileMenu)
                }
                className="flex items-center gap-3 hover:opacity-80 transition"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  👤
                </div>

                <div className="text-left">
                  <p
                    className="font-medium text-sm"
                    style={{ color: "#1e3a8a" }}
                  >
                    {user?.name || "Guest"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user?.email || ""}
                  </p>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">

                  <div className="px-4 py-3 border-b">
                    <p
                      className="font-semibold"
                      style={{ color: "#1e3a8a" }}
                    >
                      {user?.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50"
                  >
                    My Profile
                  </button>

                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50"
                  >
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
