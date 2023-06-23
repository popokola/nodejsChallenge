<template>
  <header class="relative bg-white">
    <nav aria-label="Top" class="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="relative border-b border-gray-200 px-4 pb-14 sm:static sm:px-0 sm:pb-0">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <div class="flex flex-1">
            <a href="#">
              <span class="sr-only">Your Company</span>
              <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
            </a>
          </div>

          <div class="absolute inset-x-0 bottom-0 overflow-x-auto border-t sm:static sm:border-t-0">
            <div class="flex h-14 items-center space-x-8 px-4 sm:h-auto">
              <a v-for="item in navigation" :key="item.name" :href="item.href" class="text-sm font-medium text-gray-700 hover:text-gray-800">{{ item.name }}</a>
            </div>
          </div>

          <div class="flex flex-1 items-center justify-end">
            <!-- Search -->

            <form @submit.prevent="searchProducts">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" class="p-2 text-gray-400 hover:text-gray-500">
                <span class="sr-only">Search</span>
                <SearchIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </form>

            <!-- Cart -->
            <Popover class="ml-4 z-50 flow-root text-sm lg:relative lg:ml-8">
              <PopoverButton class="group -m-2 flex items-center p-2">
                <ShoppingBagIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{{ cartItemCount }}</span>
                <span class="sr-only">items in cart, view bag</span>
              </PopoverButton>
              <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <PopoverPanel v-if="cartItemCount > 0" class="absolute inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5">
                  <h2 class="sr-only">Shopping Cart</h2>
                  <div class="mx-auto max-w-2xl px-4">
                    <ul role="list" class="divide-y divide-gray-200">
                      <li v-for="product in cartItems" :key="product.id" class="flex items-center py-6">
                        <div class="mr-4">
                          <input type="number" v-model="product.quantity" class="w-20 border-gray-200 rounded-md text-center" @input="handleQuantityChange(product.id, product.quantity)" />
                        </div>
                        <img :src="product.imageSrc" :alt="product.imageAlt" class="h-16 w-16 flex-none rounded-md border border-gray-200" />
                        <div class="ml-4 flex-auto">
                          <h3 class="font-medium text-gray-900">
                            <a :href="product.href">{{ product.name }}</a>
                          </h3>
                          <p class="text-gray-500">{{ product.color }}</p>
                        </div>
                        <button @click="removeFromCart(product.id, product.quantity)" class="ml-4 text-gray-700 hover:text-red-500 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </li>
                    </ul>
                    <p class="mt-4 font-medium text-gray-700">Total: ${{ cartTotal }}</p>
                    <button type="submit" class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Checkout</button>
                    <p class="mt-6 text-center">
                      <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">View Shopping Bag</a>
                    </p>
                  </div>
                </PopoverPanel>
                <PopoverPanel v-else class="absolute inset-x-0 top-16 pt-4 mt-2 bg-white pb-6 shadow-lg sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5">
                  <h2 class="sr-only">Shopping Cart</h2>
                  <div class="mx-auto max-w-2xl px-4">
                    <p class="text-center text-gray-700">No products in the cart</p>
                    <button @click="showEmptyCartPopover = false" class="mt-4 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Close</button>
                  </div>
                </PopoverPanel>
              </transition>
            </Popover>
          </div>
        </div>
      </div>
    </nav>
  </header>
    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Modal content -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
              <!-- Heroicon name: outline/exclamation -->
              <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <!-- Existing SVG code -->
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Filtered Products
              </h3>
              <div class="mt-2">
                <ul class="divide-y divide-gray-200">
                  <li v-for="product in filteredProducts" :key="product.id" class="py-4 flex">
                    <!-- Product information here -->
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                      <p class="text-sm text-gray-500">{{ product.price }}</p>
                    </div>
                  </li>
                  <li v-if="filteredProducts.length === 0" class="py-4">
                    <p class="text-sm text-gray-500">No products found.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="closeModal" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>


</template>
<script setup>
  import { SearchIcon, ShoppingBagIcon } from '@heroicons/vue/outline';
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
  import { computed, ref } from 'vue';
  import { useCartStore } from '@/store/cart';
  import Fuse from 'fuse.js';

  const showEmptyCartPopover = ref(false);
  const navigation = [
    { name: 'Women', href: '#' },
    { name: 'Men', href: '#' },
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ];

  const cartStore = useCartStore();
  const cartItemCount = computed(() => cartStore.cartItemCount);
  const cartItems = computed(() => cartStore.getCartItems());

  const removeFromCart = (productId, quantityToRemove) => {
    cartStore.removeFromCart(productId, quantityToRemove);
  };

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      const numericPrice = Number(item.price.replace(/[^0-9.-]+/g, ''));
      return total + numericPrice * item.quantity;
    }, 0).toFixed(2);
  });

  const handleQuantityChange = (productId, quantity) => {
    const numericQuantity = Number(quantity);
    const product = cartItems.value.find(item => item.id === productId);

    if (numericQuantity < 1) {
      removeFromCart(productId, numericQuantity);
    } else if (product && numericQuantity <= product.availableStock) {
      updateCartItemQuantity(productId, numericQuantity);
    } else {
      // Show an error message or take appropriate action
      console.log('Insufficient stock');
      product.quantity = product.availableStock;
    }
  };

  const updateCartItemQuantity = (productId, quantity) => {
    cartStore.updateCartItemQuantity(productId, quantity);
  };

  const searchQuery = ref('');
  const products = computed(() => cartStore.products);
  const filteredProducts = computed(() => {
    // Create a new instance of Fuse
    const fuse = new Fuse(products.value, {
      keys: ['name', 'description', 'category'],
      threshold: 0.3,
    });

    // Perform the search
    const result = fuse.search(searchQuery.value);

    // Return the search results
    return result.map((item) => item.item);
  });


  const showModal = ref(false);
  const openModal = () => {
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
  };
</script>
