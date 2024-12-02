import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { IClass, IPettyCash } from '@/lib/utils'

export const fetchPettyCash = createAsyncThunk('pettyCash/fetchPettyCash', async () => {
  try {
    const response = await fetch('/api/pettycash');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as IPettyCash[];
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Error fetching pettyCash:', error);
    throw error; // Re-throw the error to be handled by rejected case
  }
})

interface pettyCashState {
  pettyCash: IPettyCash[];
  pettyCashStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  pettyCashError: SerializedError | null;
}

const initialState: pettyCashState = {
  pettyCash: [],
  pettyCashStatus: 'idle',
  pettyCashError: null,
}

const pettyCashSlice = createSlice({
  name: 'pettyCash',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchPettyCash.pending, (state) => {
        state.pettyCashStatus = 'loading';
        state.pettyCashError = null; // Clear any previous errors
      })
      .addCase(fetchPettyCash.fulfilled, (state, action: PayloadAction<IPettyCash[]>) => {
        state.pettyCashStatus = 'succeeded';
        state.pettyCash = action.payload;
      })
      .addCase(fetchPettyCash.rejected, (state, action) => {
        state.pettyCashStatus = 'failed';
        state.pettyCashError = action.error; // Keep the full error object
      })
  },
})


// Selectors
const selectPettyCashState = (state: { pettyCash: pettyCashState }) => state.pettyCash;

export const selectPettyCash = createSelector(
    selectPettyCashState,
  (state) => state.pettyCash
);

export const selectPettyCashStatus = createSelector(
    selectPettyCashState,
  (state) => state.pettyCashStatus
);

export const selectpettyCashError = createSelector(
    selectPettyCashState,
  (state) => state.pettyCashError
);


export default pettyCashSlice.reducer
