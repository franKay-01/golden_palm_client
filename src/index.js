import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/cartContext';

const container = document.getElementById('root');

const app = (
  <HelmetProvider>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
      <ToastContainer/>
    </BrowserRouter>
  </HelmetProvider>
);

// react-snap prerenders each route to static HTML at build time. When that
// markup is present, hydrate it (keeps the SEO tags + first paint); otherwise
// (dev, or a route that wasn't prerendered) do a normal client render.
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}

// Unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister();
  });
}
