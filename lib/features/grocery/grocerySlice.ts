import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { IGrocery } from '@/lib/utils'

export const fetchGroceries = createAsyncThunk('grocery/fetchGroceries', async () => {
  try {
    const response = await fetch('/api/grocery');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as IGrocery[];
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Error fetching grocery:', error);
    throw error; // Re-throw the error to be handled by rejected case
  }
})

interface GroceriesState {
  grocery: IGrocery[];
  groceryStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  groceryError: SerializedError | null;
}

const initialState: GroceriesState = {
  grocery: [],
  groceryStatus: 'idle',
  groceryError: null,
}

const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroceries.pending, (state) => {
        state.groceryStatus = 'loading';
        state.groceryError = null; // Clear any previous errors
      })
      .addCase(fetchGroceries.fulfilled, (state, action: PayloadAction<IGrocery[]>) => {
        state.groceryStatus = 'succeeded';
        state.grocery = action.payload;
      })
      .addCase(fetchGroceries.rejected, (state, action) => {
        state.groceryStatus = 'failed';
        state.groceryError = action.error; // Keep the full error object
      })
  },
})


// Selectors
const selectGroceriesState = (state: { grocery: GroceriesState }) => state.grocery;

export const selectGroceries = createSelector(
    selectGroceriesState,
  (state) => state.grocery
);

export const selectGroceriesStatus = createSelector(
    selectGroceriesState,
  (state) => state.groceryStatus
);

export const selectGroceriesError = createSelector(
    selectGroceriesState,
  (state) => state.groceryError
);


export default grocerySlice.reducer
