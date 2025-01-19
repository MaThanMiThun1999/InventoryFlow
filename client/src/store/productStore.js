// src/store/productStore.js
import { create } from 'zustand';
import { postData, getData, putData, deleteData } from '../services/apiService';
import axiosInstance from '../services/axiosInstance';

const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getData('/products');
      set({ products: data?.products, isLoading: false });
    } catch (error) {
      set({ products: [], isLoading: false, error: error.message });
      throw error;
    }
  },
  fetchProductById: async (id) => {
    set({ isLoading: true, error: null, product: null });
    try {
      const data = await getData(`/products/${id}`);
      set({ product: data.product, isLoading: false });
    } catch (error) {
      set({ product: null, isLoading: false, error: error.message });
      throw error;
    }
  },
  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      // await postData('/products', productData, 'Product created successfully');
      const response = await axiosInstance.post('/products', productData, {
        // Manually set Content-Type for FormData
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        set({ isLoading: false, message: 'Product created successfully' });
      }


      // set({ isLoading: false, message: 'Product created successfully' });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      await putData(
        `/products/${id}`,
        productData,
        'Product updated successfully'
      );
      set({ isLoading: false, message: 'Product updated successfully' });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteData(`/products/${id}`, 'Product deleted successfully');
      set({ isLoading: false, message: 'Product deleted successfully' });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  searchProducts: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getData(`/products/search?query=${query}`);
      set({ products: data.products, isLoading: false });
    } catch (error) {
      set({ products: [], isLoading: false, error: error.message });
      throw error;
    }
  },
  filterProducts: async (stockLevel) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getData(`/products/filter?stockLevel=${stockLevel}`);
      set({ products: data.products, isLoading: false });
    } catch (error) {
      set({ products: [], isLoading: false, error: error.message });
      throw error;
    }
  },
}));

export default useProductStore;
