<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
      <h2 class="sr-only">Products</h2>

      <div class="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="product in products" :key="product.id" class="group relative border-b border-r border-gray-200 p-4 sm:p-6">
          <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
            <img :src="product.imageSrc" :alt="product.imageAlt" class="h-full w-full object-cover object-center" />
          </div>
          <div class="pb-4 pt-10 text-center">
            <h3 class="text-sm font-medium text-gray-900">
             
              {{ product.name }}
            </h3>
            <div class="mt-3 flex flex-col items-center">
              <p class="sr-only">{{ product.rating }} out of 5 stars</p>
              <p class="mt-1 text-sm text-gray-500">{{ product.reviewCount }} reviews</p>
            </div>
            <p class="mt-4 text-base font-medium text-gray-900">{{ product.price }}</p>
            <div class="mt-4">
              <button
                @click="addToCart(product)"
                :disabled="handleDisable(product)"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md disabled:bg-indigo-300 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {{handleDisable(product) ? 'Out of Stock' : 'Add to Bag' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, computed } from 'vue';
  import { useCartStore } from '@/store/cart';

  const products = ref([
    {
      id: 1,
      name: 'Organize Basic Set (Walnut)',
      price: '$149',
      rating: 5,
      reviewCount: 38,
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-01.jpg',
      imageAlt: 'TODO',
      availableStock: 3,
      href: '#',
    },
    {
      id: 2,
      name: 'Organize Pen Holder',
      price: '$15',
      rating: 5,
      reviewCount: 18,
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-02.jpg',
      imageAlt: 'TODO',
      availableStock: 5,
      href: '#',
    },
    {
      id: 3,
      name: 'Organize Sticky Note Holder',
      price: '$15',
      rating: 5,
      reviewCount: 14,
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-03.jpg',
      imageAlt: 'TODO',
      availableStock: 4,
      href: '#',
    },
    {
      id: 4,
      name: 'Organize Phone Holder',
      price: '$15',
      rating: 4,
      reviewCount: 21,
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-04.jpg',
      imageAlt: 'TODO',
      availableStock: 5,
      href: '#',
    },
    // More products...
  ]);

  const cartStore = useCartStore();
  const cartItems = computed(() => cartStore.getCartItems);

  const handleDisable = (product) => {
    //check if product is in cart and get the quantity of the cart
    const cartItem = cartItems.value.find((item) => item.id === product.id);
    return product.availableStock <= 0 || (cartItem && cartItem.quantity >= product.availableStock);
  };
  const addToCart = (product) => {
    console.log('add to cart', product);
    cartStore.addToCart(product);
  };

</script>