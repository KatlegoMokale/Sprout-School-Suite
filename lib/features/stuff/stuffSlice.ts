import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { IStuff } from '@/lib/utils'

export const fetchStuff = createAsyncThunk('stuff/fetchStuff', async () => {
  try {
    const response = await fetch('/api/stuff');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as IStuff[];
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Error fetching stuff:', error);
    throw error; // Re-throw the error to be handled by rejected case
  }
})

interface stuffState {
  stuff: IStuff[];
  stuffStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  stuffError: SerializedError | null;
}

const initialState: stuffState = {
  stuff: [],
  stuffStatus: 'idle',
  stuffError: null,
}

const stuffSlice = createSlice({
  name: 'stuff',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchStuff.pending, (state) => {
        state.stuffStatus = 'loading';
        state.stuffError = null; // Clear any previous errors
      })
      .addCase(fetchStuff.fulfilled, (state, action: PayloadAction<IStuff[]>) => {
        state.stuffStatus = 'succeeded';
        state.stuff = action.payload;
      })
      .addCase(fetchStuff.rejected, (state, action) => {
        state.stuffStatus = 'failed';
        state.stuffError = action.error; // Keep the full error object
      })
  },
})


// Selectors
const selectStuffState = (state: { stuff: stuffState }) => state.stuff;

export const selectStuff = createSelector(
  selectStuffState,
  (state) => state.stuff
);

export const selectStuffStatus = createSelector(
  selectStuffState,
  (state) => state.stuffStatus
);

export const selectStuffError = createSelector(
  selectStuffState,
  (state) => state.stuffError
);


export default stuffSlice.reducer
