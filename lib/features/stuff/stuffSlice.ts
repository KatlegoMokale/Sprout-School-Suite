import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { IStuff } from '@/lib/utils'

export const fetchStuff = createAsyncThunk('stuff/fetchStuff', async () => {
  try {
    console.log('Fetching staff data...');
    const response = await fetch('/api/stuff');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Received staff data:', data);
    if (!data) {
      throw new Error('No data received from server');
    }
    if (!Array.isArray(data)) {
      throw new Error('Received invalid data format');
    }
    return data as IStuff[];
  } catch (error: any) {
    console.error('Error fetching staff:', error);
    throw error;
  }
})

interface StuffState {
  stuff: IStuff[];
  stuffStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  stuffError: SerializedError | null;
}

const initialState: StuffState = {
  stuff: [],
  stuffStatus: 'idle',
  stuffError: null,
}

const stuffSlice = createSlice({
  name: 'stuff',
  initialState,
  reducers: {
    clearStuff: (state) => {
      state.stuff = [];
      state.stuffStatus = 'idle';
      state.stuffError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStuff.pending, (state) => {
        console.log('Staff fetch pending...');
        state.stuffStatus = 'loading';
        state.stuffError = null;
      })
      .addCase(fetchStuff.fulfilled, (state, action: PayloadAction<IStuff[]>) => {
        console.log('Staff fetch succeeded:', action.payload);
        state.stuffStatus = 'succeeded';
        state.stuff = action.payload || [];
        state.stuffError = null;
      })
      .addCase(fetchStuff.rejected, (state, action) => {
        console.error('Staff fetch failed:', action.error);
        state.stuffStatus = 'failed';
        state.stuffError = action.error;
        state.stuff = [];
      })
  },
})

export const { clearStuff } = stuffSlice.actions;

// Selectors
const selectStuffState = (state: { stuff: StuffState }) => state.stuff;

export const selectStuff = createSelector(
  selectStuffState,
  (state) => {
    console.log('Selecting staff:', state.stuff);
    return state.stuff || [];
  }
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
