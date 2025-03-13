"use client"
import React, { useState, useEffect } from 'react';
import {useCart } from "../../context/Cartcontext.js";
import Link from "next/link";
export default function CartPage() {
    const { cart,totalPrice , AddToCart, removeFromCart, clearCart } = useCart();
  
    if (cart.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">{"Looks like you haven't added any products to your cart yet."}</p>
         <Link href={`/`}>
         <button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Start Shopping
          </button>
         </Link> 
        </div>
      );
    }
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
        
        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <section className="lg:col-span-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.id} className="p-4 sm:p-6">
                    <div className="flex items-center sm:items-start">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={item.thumbnail || item.image}
                          alt={item.title}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      
                      <div className="ml-6 flex-1 flex flex-col">
                        <div className="flex">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          
                          <div className="ml-4 flex-shrink-0 flow-root">
                            <button
                              type="button"
                              // onClick={() => removeItemCompletely(item.id)}
                              className="-m-2.5 p-2.5 flex items-center text-gray-400 hover:text-gray-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              <span className="sr-only">Remove</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-gray-500 p-2 rounded-md"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                            
                            <span className="text-gray-900 text-sm mx-2">
                              {item.quantity}
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => AddToCart(item)}
                              className="text-gray-400 hover:text-gray-500 p-2 rounded-md"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="ml-2 text-sm text-gray-500">
                              (${item.price.toFixed(2)} each)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    Clear Cart
                  </button>
                  <p className="font-medium text-gray-900">
                    {cart.length} {cart.length === 1 ? 'product' : 'products'} in cart
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Order summary */}
          <section className="mt-16 bg-white rounded-lg shadow px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-4">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">${totalPrice.toFixed(2)}</dd>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-sm text-gray-600">Shipping estimate</dt>
                <dd className="text-sm font-medium text-gray-900">$5.99</dd>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">${(totalPrice + 5.99).toFixed(2)}</dd>
              </div>
            </dl>
            
            <div className="mt-6">
              <button
                type="button"
                className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Checkout
              </button>
            </div>
            
            <div className="mt-6 text-sm text-center text-gray-500">
              <p>
                or{' '}
                <Link href={`/`} className="text-blue-600 font-medium hover:text-blue-500">
                  <p>
                    continous shopping
                  <span aria-hidden="true"> &rarr;</span>
                    </p>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }