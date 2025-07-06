import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category, CategoriesResponse, categoriesApi } from '../../services/api';

// Interface para o estado das categorias
interface CategoriesState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
  filters: {
    name: string;
  };
  pagination: {
    page: number; 
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Estado inicial
const initialState: CategoriesState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  filters: {
    name: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
};

// Ação assíncrona para buscar a lista de categorias
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params?: { page?: number; pageSize?: number; name?: string }) => {
    const response = await categoriesApi.getCategories(params);
    return response;
  }
);

// Ação assíncrona para buscar uma categoria por ID
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: number) => {
    const response = await categoriesApi.getCategoryById(id);
    return response;
  }
);

// Criação do slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Atualiza os filtros
    setFilters: (state, action: PayloadAction<Partial<CategoriesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Limpa a categoria selecionada
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCategories: estado pendente
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // fetchCategories: sucesso
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      // fetchCategories: erro
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar categorias';
      })
      // fetchCategoryById: sucesso
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      });
  },
});

// Exporta as ações e o reducer
export const { setFilters, clearSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;