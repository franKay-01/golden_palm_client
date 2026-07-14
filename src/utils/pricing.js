// Sale-pricing helpers. Products may return: price (original), sale_price, on_sale.
// A product is effectively on sale only when on_sale is true, sale_price is a valid
// number, and it's actually lower than the original price.

export const isOnSale = (p) => {
  if (!p || p.on_sale !== true) return false;
  const price = parseFloat(p.price);
  const sale = parseFloat(p.sale_price);
  return !isNaN(sale) && !isNaN(price) && sale > 0 && sale < price;
};

// The price the customer actually pays — must be sent as unit_price to cart/checkout,
// because the backend validates against it and rejects a mismatch.
export const effectiveUnitPrice = (p) =>
  isOnSale(p) ? parseFloat(p.sale_price) : parseFloat(p?.price);

// Rounded percentage discount, e.g. 25 for "25% off". 0 when not on sale.
export const percentOff = (p) =>
  isOnSale(p)
    ? Math.round(((parseFloat(p.price) - parseFloat(p.sale_price)) / parseFloat(p.price)) * 100)
    : 0;
