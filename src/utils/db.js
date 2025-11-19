import Dexie from 'dexie';

export const db = new Dexie('GoldenPalmDB');

db.version(1).stores({
  cart: '++id, productId, heat_level, name, price, unit_price, quantity, img_url, type, weight, product_details'
});

db.version(2).stores({
  cart: '++id, productId, heat_level, name, price, unit_price, quantity, img_url, type, weight, product_details',
  sessionData: 'key, value, timestamp'
});

// Helper functions for session data
export const sessionDataHelpers = {
  // Set a session data value
  async set(key, value) {
    return await db.sessionData.put({
      key,
      value,
      timestamp: Date.now()
    });
  },

  // Get a session data value
  async get(key) {
    const data = await db.sessionData.get(key);
    return data?.value;
  },

  // Remove a session data value
  async remove(key) {
    return await db.sessionData.delete(key);
  },

  // Clear all session data
  async clear() {
    return await db.sessionData.clear();
  }
};
