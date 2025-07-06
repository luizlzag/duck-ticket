
import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    cart: cartReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
