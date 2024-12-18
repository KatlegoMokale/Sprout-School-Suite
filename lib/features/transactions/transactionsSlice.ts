import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import {  ITransactions } from '@/lib/utils'

export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async () => {
  try {
    const response = await fetch('/api/transactions');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as ITransactions[];
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Error fetching transactions:', error);
    throw error; // Re-throw the error to be handled by rejected case
  }
})

interface transactionsState {
  transactions: ITransactions[];
  transactionsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  transactionsError: SerializedError | null;
}

const initialState: transactionsState = {
  transactions: [],
  transactionsStatus: 'idle',
  transactionsError: null,
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.transactionsStatus = 'loading';
        state.transactionsError = null; // Clear any previous errors
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<ITransactions[]>) => {
        state.transactionsStatus = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactionsStatus = 'failed';
        state.transactionsError = action.error; // Keep the full error object
      })
  },
})


// Selectors
const selectTransactionsState = (state: { transactions: transactionsState }) => state.transactions;

export const selectTransactions = createSelector(
  selectTransactionsState,
  (state) => state.transactions
);

export const selectTransactionsStatus = createSelector(
  selectTransactionsState,
  (state) => state.transactionsStatus
);

export const selectTransactionsError = createSelector(
  selectTransactionsState,
  (state) => state.transactionsError
);


export default transactionsSlice.reducer
