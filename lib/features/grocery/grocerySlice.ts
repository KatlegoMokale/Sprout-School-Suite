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
    console.error('Error fetching groceries:', error);
    throw error; // Re-throw the error to be handled by rejected case
  }
})

interface GroceriesState {
  groceries: IGrocery[];
  groceriesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  groceriesError: SerializedError | null;
}

const initialState: GroceriesState = {
  groceries: [],
  groceriesStatus: 'idle',
  groceriesError: null,
}

const groceriesSlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroceries.pending, (state) => {
        state.groceriesStatus = 'loading';
        state.groceriesError = null; // Clear any previous errors
      })
      .addCase(fetchGroceries.fulfilled, (state, action: PayloadAction<IGrocery[]>) => {
        state.groceriesStatus = 'succeeded';
        state.groceries = action.payload;
      })
      .addCase(fetchGroceries.rejected, (state, action) => {
        state.groceriesStatus = 'failed';
        state.groceriesError = action.error; // Keep the full error object
      })
  },
})


// Selectors
const selectGroceriesState = (state: { groceries: GroceriesState }) => state.groceries;

export const selectGroceries = createSelector(
    selectGroceriesState,
  (state) => state.groceries
);

export const selectGroceriesStatus = createSelector(
    selectGroceriesState,
  (state) => state.groceriesStatus
);

export const selectGroceriesError = createSelector(
    selectGroceriesState,
  (state) => state.groceriesError
);


export default groceriesSlice.reducer
