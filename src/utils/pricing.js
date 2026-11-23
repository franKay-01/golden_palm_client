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

// Dollars saved by buying a bundle instead of its items separately, computed live:
// (sum of the component products' regular prices) - (what the bundle costs now, sale included).
// Each component counts once. Null when there's nothing to claim or a component price is missing,
// so we never show a made-up figure.
export const bundleSavings = (b) => {
  const parts = b?.product_details;
  if (!Array.isArray(parts) || parts.length === 0) return null;
  const prices = parts.map((p) => parseFloat(p?.price));
  if (prices.some((n) => isNaN(n))) return null;
  const savings = prices.reduce((sum, n) => sum + n, 0) - effectiveUnitPrice(b);
  return savings > 0.004 ? savings : null;
};

// Dollars saved per unit while on sale, e.g. "2.50". Empty string when not on sale.
export const amountOff = (p) =>
  isOnSale(p) ? (parseFloat(p.price) - parseFloat(p.sale_price)).toFixed(2) : '';

// Rounded percentage discount, e.g. 25 for "25% off". 0 when not on sale.
export const percentOff = (p) =>
  isOnSale(p)
    ? Math.round(((parseFloat(p.price) - parseFloat(p.sale_price)) / parseFloat(p.price)) * 100)
    : 0;
