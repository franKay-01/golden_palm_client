// Mirrors the retail shipping charge built in golden_palm_api
// (api/routes/stripe_transaction.js, POST /create-checkout-session). Keep the two in sync:
//   base by item count: 1-2 -> $9, 3-4 -> $11, 5-19 -> $14, 20+ -> custom quote
//   charged = round(base + 3% of (items subtotal + base)), in whole dollars
// The 3% is deliberately folded into the shipping figure shown to customers.
export const SHIPPING_CONTACT_THRESHOLD = 20;

export const estimateShipping = (itemCount, subtotal) => {
  if (!itemCount || itemCount < 1) return { amount: 0, needsQuote: false };
  if (itemCount >= SHIPPING_CONTACT_THRESHOLD) return { amount: null, needsQuote: true };
  const base = itemCount <= 2 ? 9 : itemCount <= 4 ? 11 : 14;
  const amount = Math.round(base + (Number(subtotal) + base) * 0.03);
  return { amount, needsQuote: false };
};

export const cartItemCount = (cart) =>
  (cart || []).reduce((n, item) => n + (Number(item.quantity) || 0), 0);
