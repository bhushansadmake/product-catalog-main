"use client"
import axios from 'axios';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import {useCart } from "../context/Cartcontext.js";
import { useFilters} from "../context/Filtercontext.js";

const ProductList = () => {
  // State management  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [searchQuery, setSearchQuery] = useState('');
  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const {cart,AddToCart} = useCart();
  const {filters, updateFilters} = useFilters();
  const productsPerPage = 8;
  
  // Fetch categories on component mount
  useEffect(() => {
  fetchCategories();
  fetchProducts();
 
  startStockPolling();
}, []);

const startStockPolling = () => {
  const interval = setInterval(async () => {
    try {
      const response = await axios.get('https://dummyjson.com/products');

      const stockDataCheck = JSON.parse(localStorage.getItem('productStock')) || {};
      console.log("app", stockDataCheck);
      
      if(!Object.keys(stockDataCheck).length){
         const stockData = response.data.products.reduce((acc, product) => {
          acc[product.id] = product.stock;
          return acc;
        }, {});
        
        localStorage.setItem('productStock', JSON.stringify(stockData));
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
    }
  }, 5000); // Poll every 5 seconds
  return () => clearInterval(interval);
};

const getStockStatus = (productId) => {
  const stockData = JSON.parse(localStorage.getItem('productStock')) || {};
  return stockData[productId] || 0;
};



  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, searchQuery, rating, currentPage]);
  
  const fetchCategories = async () => {
    try {
      const response = await axios('https://dummyjson.com/products/categories');
      // const data = await response.json();
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error(err);
    }
  };
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = 'https://dummyjson.com/products';
      
      // Add search query if exists
      if (searchQuery) {
        url = `https://dummyjson.com/products/search?q=${searchQuery}`;
      }
      
      const response = await fetch(url);
      let data = await response.json();
      
      // Filter by category
      if (selectedCategory && data.products) {
        data.products = data.products.filter(product => 
          product.category === selectedCategory
        );
      }
      
      // Filter by price
      if (data.products) {
        data.products = data.products.filter(product => 
          product.price >= minPrice && product.price <= maxPrice
        );
      }
      
      // Filter by rating
      if (rating > 0 && data.products) {
        data.products = data.products.filter(product => 
          product.rating >= rating
        );
      }
      
      // Pagination
      const totalProducts = data.products ? data.products.length : 0;
      const startIndex = (currentPage - 1) * productsPerPage;
      
      if (data.products) {
        data.products = data.products.slice(startIndex, startIndex + productsPerPage);
      }
      updateFilters({category: selectedCategory, priceRange:[minPrice,maxPrice],rating : rating});
      setProducts(data.products || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
      console.error(err);
    }
  };
  
  const resetFilters = () => {
    setSelectedCategory('');
    setMinPrice(0);
    setMaxPrice(2000);
    setSearchQuery('');
    setRating(0);
    setCurrentPage(1);
  };
  



  // Simple Star component
  const Star = ({ filled }) => (
    <span className={`text-lg ${filled ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
  );

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} filled={i <= roundedRating} />);
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href={`/`}>
              <h1 className="text-2xl font-bold text-blue-600">Advanced Product Catalog</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {/* Simple Cart Text */}
                <Link href={`/Carts`}>
                <span className="text-lg font-bold">Cart</span>
                </Link>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full bg-white p-2 rounded-md shadow flex justify-between items-center"
            >
              <span className="font-semibold">Filters</span>
              <span>{showMobileFilters ? '▲' : '▼'}</span>
            </button>
          </div>

          {/* Filter Sidebar */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white p-4 rounded-md shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Category</h3>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {  categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.slug}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex space-x-2 items-center mb-2">
                  <input
                    type="number"
                    className="w-full p-1 border rounded-md"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    min="0"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    className="w-full p-1 border rounded-md"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    min={minPrice}
                  />
                </div>
                <input
                  type="range"
                  className="w-full"
                  min="0"
                  max="2000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Minimum Rating</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star filled={star <= rating} />
                    </button>
                  ))}
                  {rating > 0 && (
                    <button
                      onClick={() => setRating(0)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
            ) : products.length === 0 ? (
              <div className="bg-yellow-100 p-4 rounded-md text-yellow-700">
                No products found. Try changing your filters.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    
                    <div  key={product.id}  className="bg-white rounded-lg shadow-md overflow-hidden">
                      <Link 
                      key={product.id}
                      href={`/Product/${product.id}`}
                       passHref>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-t-lg max-w-full"
                        />
                        </Link>
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-1 truncate">{product.title}</h2>
                        <div className="flex items-center mb-2">
                          {renderStars(product.rating)}
                          <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-lg font-bold">${product.price}</span>
                          <span className={getStockStatus(product.id) > 0 ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
                            {getStockStatus(product.id) > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        <button
                          onClick={() => AddToCart(product)}
                          disabled={getStockStatus(product.id) === 0}
                          className={`mt-3 w-full py-2 px-4 rounded font-bold text-white ${
                            getStockStatus(product.id) > 0 
                            ? 'bg-blue-500 hover:bg-blue-700' 
                            : 'bg-gray-300 cursor-not-allowed'
                          }`}
                          >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 rounded bg-white border disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={products.length < productsPerPage}
                    className="px-3 py-1 mx-1 rounded bg-white border disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductList;