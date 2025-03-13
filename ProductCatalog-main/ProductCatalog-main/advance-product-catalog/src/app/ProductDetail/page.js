"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/Cartcontext";
import Link from "next/link";
import axios from "axios";

const ProductDetail = ({ id = 1 }) => { 
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { cart, AddToCart } = useCart();

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`https://dummyjson.com/products/${id}`);
      setProduct(response.data);
      fetchRelatedProducts(response.data.category);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await axios.get(`https://dummyjson.com/products/category/${category}?limit=4`);
      setRelatedProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (!product) return <p className="text-center text-lg font-bold">Loading...</p>;

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href={`/`}>
              <h1 className="text-2xl font-bold text-blue-600">Advanced Product Catalog</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Link href={`/carts`}>
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img src={product.thumbnail} alt={product.title} className="w-full md:w-1/2 rounded-lg shadow-md" />
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold text-green-600 mb-2">${product.price}</p>
            <p className="text-yellow-500 font-semibold">⭐ {product.rating} / 5</p>
            <p className={`mt-2 ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
            <button onClick={() => AddToCart(product)} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg shadow-md">
                <img src={item.thumbnail} alt={item.title} className="w-full h-40 object-cover rounded" />
                <h3 className="text-lg font-medium mt-2">{item.title}</h3>
                <p className="text-gray-600">${item.price}</p>
                <Link href={`/Product/${item.id}`}>
                  <button className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
