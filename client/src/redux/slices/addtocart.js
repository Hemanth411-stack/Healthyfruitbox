import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { productId, productType, quantity = 1, addOnPrices = {}, notes },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = getState().user?.userInfo?.token;
      const { data } = await axios.post(
        'http://localhost:5000/api/subscriptions/addtocart',
        { productId, productType, quantity, addOnPrices, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add to cart' });
    }
  }
);

export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user?.userInfo?.token;
      const { data } = await axios.get('http://localhost:5000/api/subscriptions/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch cart' });
    }
  }
);

export const deleteCart = createAsyncThunk(
  'cart/deleteCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user?.userInfo?.token;
      const { data } = await axios.delete('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete cart' });
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async ({ productId, productType }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user?.userInfo?.token;
      const { data } = await axios.delete(
        `http://localhost:5000/api/cart/${productId}/${productType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove item' });
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ productId, productType, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user?.userInfo?.token;
      const { data } = await axios.put(
        'http://localhost:5000/api/subscriptions/update-cart',
        { productId, productType, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update cart quantity' });
    }
  }
);

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalPrice: 0,
    notes: '',
    loading: false,
    error: null,
    success: false,
    lastUpdated: null
  },
  reducers: {
    resetCartStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCartState: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.notes = '';
      state.lastUpdated = Date.now();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items = action.payload.data.products || [];
        console.log("items what",state.items)
        state.totalPrice = action.payload.data.totalPrice || 0;
        state.notes = action.payload.data.notes || '';
        state.lastUpdated = Date.now();
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add to cart';
      })
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data?.products || [];
        console.log("items",state.items)
        state.totalPrice = action.payload.data?.totalPrice || 0;
        state.notes = action.payload.data?.notes || '';
        state.lastUpdated = Date.now();
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch cart';
      })
      .addCase(deleteCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCart.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.items = [];
        state.totalPrice = 0;
        state.notes = '';
        state.lastUpdated = Date.now();
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete cart';
      })
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items = action.payload.data?.products || [];
        state.totalPrice = action.payload.data?.totalPrice || 0;
        state.notes = action.payload.data?.notes || '';
        state.lastUpdated = Date.now();
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove item';
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items = action.payload.data?.products || [];
        state.totalPrice = action.payload.data?.totalPrice || 0;
        state.notes = action.payload.data?.notes || '';
        state.lastUpdated = Date.now();
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update cart quantity';
      });
  }
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
console.log("log items ",selectCartItems)
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
// Add this to your selectors section
export const selectCartItemCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const { resetCartStatus, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;