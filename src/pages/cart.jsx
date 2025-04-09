import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrashCan, 
  faCartShopping, 
  faFaceSadTear,
  faStore
} from '@fortawesome/free-solid-svg-icons';

function Cart() {
  const [cart, setCart] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
   
    window.dispatchEvent(new Event('storage'));
  };

  const handleUpdateQuantity = (productId, delta) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const handleCheckout = () => {
    setShowConfirmation(true);
    
    setCart([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => {
      setShowConfirmation(false);
    }, 4000);
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {showConfirmation && (
        <div className="fixed top-20 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
          Order placed successfully!
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md">
          <div className="mb-6 text-blue-600 opacity-80">
            <FontAwesomeIcon icon={faCartShopping} className="text-8xl" />
          </div>
          <div className="flex items-center mb-4">
            <FontAwesomeIcon icon={faFaceSadTear} className="text-yellow-500 text-2xl mr-2" />
            <h3 className="text-xl font-semibold text-gray-700">Your cart is empty</h3>
          </div>
          <p className="text-gray-500 mb-8 text-center">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link 
            to="/" 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faStore} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cart.map((product) => (
              <div key={product.id} className="border-b p-4 flex items-center justify-between flex-wrap">
                <div className="flex items-center mb-2 sm:mb-0">
                  <img src={product.image} alt={product.title} className="w-16 h-16 object-contain mr-4" />
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{product.title}</h4>
                    <p className="text-blue-600 font-medium">${product.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => handleUpdateQuantity(product.id, -1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3">{product.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(product.id, 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveFromCart(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                  >
                   <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h3>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 cursor-pointer font-semibold"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;