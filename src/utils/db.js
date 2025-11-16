import Dexie from 'dexie';

export const db = new Dexie('GoldenPalmDB');

db.version(1).stores({
  cart: '++id, productId, heat_level, name, price, unit_price, quantity, img_url, type, weight, product_details'
});
