import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: getStoredItems(), // Load items from local storage on initialization
  }),
  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveItems(); // Save updated items to local storage
    },
    removeFromCart(productId, quantity) {
      this.items = this.items.filter((item) => item.id !== productId);
      this.saveItems(); // Save updated items to local storage
    },
    updateCartItemQuantity(productId, quantity) {
      const item = this.items.find((item) => item.id === productId);
      if (item) {
        item.quantity = parseInt(quantity, 10); // Ensure quantity is parsed as an integer
        this.saveItems(); // Save updated items to local storage
      }
    },
    saveItems() {
      localStorage.setItem('cartItems', JSON.stringify(this.items));
    },
  },
  getters: {
    cartItemCount() {
      return this.items.reduce((count, item) => count + item.quantity, 0);
    },
    getCartItems() {
      return this.items;
    },
    uniqueCartItems() {
      // Return unique items based on their IDs
      return [...new Map(this.items.map((item) => [item.id, item])).values()];
    },
    cartTotal() {
      // Calculate the total price of all items in the cart
      return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },  
});

// Helper function to initialize the cart items from local storage
function getStoredItems() {
  const storedItems = localStorage.getItem('cartItems');
  return storedItems ? JSON.parse(storedItems) : [];
}
