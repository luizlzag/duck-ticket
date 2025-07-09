import axios from 'axios';

const API_BASE_URL = 'https://duck-ticket-api-main.vercel.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos TypeScript para a API

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
}

export interface Ticket {
  id: number;
  name: string;
  price: number;
  quantityAvailable: number | null;
  sales_end_date: string;
}

// Nova interface para colunas de setor
export interface SectorColumn {
  columnIndex: number;
  startSeat: number;
  endSeat: number;
}

// Novo formato de Seat
export interface Seat {
  rowLabel: string;       // ex: "A"
  seatNumber: number;     // ex: 1
  columnIndex: number;    // ex: 0
  status: 'available' | 'reserved' | 'sold';
}

export interface Sector {
  id: number;
  code: string;           // ex: "A"
  name: string;
  price: number;
  block: 'left' | 'center' | 'right';
  rowIndex: number;
  columns: number;
  sectorColumns: SectorColumn[];
  seats: Seat[];
}

export interface Performance {
  id: number;
  start_time: string;
  end_time: string;
  venue: Venue;
  tickets: Ticket[];
  seatingEnabled: boolean;
  sectors: Sector[];
}

export interface Category {
  id: number;
  name: string;
  icon_svg: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  img_event?: string;
  policy: string;
  categories: Category[];
  performances: Performance[];
}

export interface EventsResponse {
  data: Event[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Login types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CategoriesResponse {
  data: Category[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Funções da API
export const eventsApi = {
  getEvents: (params?: {
    page?: number;
    pageSize?: number;
    categoryId?: number;
    location?: string;
    date?: string;
  }): Promise<EventsResponse> => {
    return api.get('/events', { params }).then(response => response.data);
  },

  getEventById: (id: number): Promise<Event> => {
    return api.get(`/event/${id}`).then(response => response.data);
  },
};

// Auth API functions
export const authApi = {
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post('/login', credentials).then(response => response.data);
  },
};

// Categories API functions
export const categoriesApi = {
  getCategories: (params?: {
    page?: number;
    pageSize?: number;
    name?: string;
  }): Promise<CategoriesResponse> => {
    return api.get('/categories', { params }).then(response => response.data);
  },

  getCategoryById: (id: number): Promise<Category> => {
    return api.get(`/categories/${id}`).then(response => response.data);
  },
};