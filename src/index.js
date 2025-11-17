import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/cartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <CartProvider>
      <App />
    </CartProvider>
    <ToastContainer/>
  </BrowserRouter>
);

// Unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister();
  });
}
