import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, LoginRequest } from '../../services/api';

interface UserState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  token: string | null;
  purchaseHistory: unknown[];
  loading: boolean;
  error: string | null;
}

const tokenFromStorage = localStorage.getItem('token');


const initialState: UserState = {
  isAuthenticated: Boolean(tokenFromStorage), 
  user: null,
  token: tokenFromStorage,
  purchaseHistory: [],
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao fazer login');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.purchaseHistory = [];
      state.error = null;
      localStorage.removeItem('token');
    },
    addToPurchaseHistory: (state, action: PayloadAction<unknown>) => {
      state.purchaseHistory.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, addToPurchaseHistory, clearError } = userSlice.actions;
export default userSlice.reducer;