
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  eventId: number;
  eventTitle: string;
  performanceId: number;
  ticketId: number;
  ticketName: string;
  price: number;
  quantity: number;
  venue: string;
  date: string;
  selectedSeats?: string[];
}

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => 
          item.eventId === action.payload.eventId && 
          item.ticketId === action.payload.ticketId &&
          item.performanceId === action.payload.performanceId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => 
        `${item.eventId}-${item.ticketId}-${item.performanceId}` !== action.payload
      );
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => 
        `${item.eventId}-${item.ticketId}-${item.performanceId}` === action.payload.id
      );
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleCart, 
  setCartOpen 
} = cartSlice.actions;
export default cartSlice.reducer;
