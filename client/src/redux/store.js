import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productSliceReducer from "../redux/slices/product.js";
import subscriptionSliceReducer from "../redux/slices/Subscription.js"
import userSliceReducer from './slices/Userslice.js';
import userInfoSliceReducer from "../redux/slices/Userinformation.js"
import deliverySliceReducer from "../redux/slices/delivery.js"
import deliveryBoyAuthSliceReducer from '../redux/slices/deliveryboiauth.js'
import deliverymanagementSliceReducer from '../redux/slices/deliverymanagement.js'
import adminsubscriptionSliceReducer from '../redux/slices/adminsubscription.js'
import cancelsubscriptionSliceReducer from "../redux/slices/admindelete.js"
import cartSliceReducer from "../redux/slices/addtocart.js"
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['userInfo'] // Only persist the token field from user slice
};
const deliveryBoyPersistConfig = {
  key: 'deliveryBoyAuth',
  storage,
  whitelist: ['token'] // Only persist the token field from delivery boy slice
};

const rootReducer = combineReducers({
  // Persisted reducers
  user: persistReducer(userPersistConfig, userSliceReducer),
  deliveryBoyAuth: persistReducer(deliveryBoyPersistConfig, deliveryBoyAuthSliceReducer),
  //deliveryBoyAuth: persistReducer(deliveryBoyPersistConfig, deliveryBoyAuthSliceReducer),
  
  // Non-persisted reducers
  products: productSliceReducer,
  subscriptions : subscriptionSliceReducer,
  userInfo: userInfoSliceReducer,
  delivery : deliverySliceReducer,
  deliveriesmanagement: deliverymanagementSliceReducer,
  adminsubscriptions: adminsubscriptionSliceReducer,
  cancelsubscription: cancelsubscriptionSliceReducer,
  cart:cartSliceReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      // Optional: Add logging middleware for debugging
      (store) => (next) => (action) => {
        if (process.env.NODE_ENV === 'development') {
          if (action.type.endsWith('/fulfilled')) {
            console.log('Redux Action:', action.type);
          }
        }
        return next(action);
      }
    ),
  devTools: process.env.NODE_ENV !== 'production'
});

// Export persistor for both user and delivery boy auth token persistence
export const persistor = persistStore(store);