"use client";
import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const AddToCart = (product) => {
        const stockData = JSON.parse(localStorage.getItem('productStock')) || {};
        if(stockData[product.id]>0){
            stockData[product.id]--;
            console.log("cartcontext", stockData);
            localStorage.setItem('productStock', JSON.stringify(stockData));
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1} : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        const stockData = JSON.parse(localStorage.getItem('productStock')) || {};
        if(stockData[productId]>=0){
            stockData[productId]++;
            localStorage.setItem('productStock', JSON.stringify(stockData));
        }
        
        setCart(prevCart => {
          
        const existingItem = prevCart.find(item => item.id === productId);
          
         
          if (existingItem?.quantity === 1) {

            return prevCart.filter(item => item.id !== productId);
          }
          return prevCart.map(item => 
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          );
        });
      };
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    const clearCart = ()=>{
        setCart([]);
    }

    return (
        <CartContext.Provider value={{ cart, AddToCart, removeFromCart,clearCart ,totalPrice}}>
            {children}
        </CartContext.Provider>
    );
}
export const useCart = () => useContext(CartContext);