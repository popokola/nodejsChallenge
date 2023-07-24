import { defineStore } from 'pinia';


const products = [
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
];



export const useProductStore = defineStore('product', {
    state: () => ({
        products: products,
        cart: [],
    }),
    getters: {
        getProducts() {
            return this.products;
        }
    },
});



