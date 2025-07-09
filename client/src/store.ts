import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state for search
interface SearchState {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: string;
}

const initialSearchState: SearchState = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  passengers: 1,
  cabinClass: 'economy',
};

const searchSlice = createSlice({
  name: 'search',
  initialState: initialSearchState,
  reducers: {
    setSearchParams(state, action: PayloadAction<Partial<SearchState>>) {
      return { ...state, ...action.payload };
    },
    resetSearchParams() {
      return initialSearchState;
    },
  },
});

export const { setSearchParams, resetSearchParams } = searchSlice.actions;

export const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
    // Add more slices here for scalability
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 