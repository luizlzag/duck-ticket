
import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import categoriesReducer from './slices/categorySlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    cart: cartReducer,
    user: userReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
