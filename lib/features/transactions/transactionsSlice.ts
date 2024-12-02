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
  transactionstatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  studentError: SerializedError | null;
}

const initialState: transactionsState = {
  transactions: [],
  transactionstatus: 'idle',
  studentError: null,
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.transactionstatus = 'loading';
        state.studentError = null; // Clear any previous errors
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<ITransactions[]>) => {
        state.transactionstatus = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactionstatus = 'failed';
        state.studentError = action.error; // Keep the full error object
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
  (state) => state.transactionstatus
);

export const selectTransactionsError = createSelector(
  selectTransactionsState,
  (state) => state.studentError
);


export default transactionsSlice.reducer
