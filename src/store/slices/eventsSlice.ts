
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Event, EventsResponse, eventsApi } from '../../services/api';

interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
  filters: {
    categoryId: number;
    location: string;
    date: string;
    search: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const initialState: EventsState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  filters: {
    categoryId: 0,
    location: '',
    date: '',
    search: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params?: { page?: number; categoryId?: number; location?: string; date?: string }) => {
    const response = await eventsApi.getEvents(params);
    return response;
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id: number) => {
    const response = await eventsApi.getEventById(id);
    return response;
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<EventsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar eventos';
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedEvent = action.payload;
      });
  },
});

export const { setFilters, clearSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
