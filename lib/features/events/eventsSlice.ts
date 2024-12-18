import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { IEvent } from '@/lib/utils'

export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
  try {
    const response = await fetch('/api/event');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as IEvent[];
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Error fetching events:', error);
    throw error; // Re-throw the error to be handled by rejected case
  }
})

interface EventsState {
  events: IEvent[];
  eventsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  eventsError: SerializedError | null;
}

const initialState: EventsState = {
  events: [],
  eventsStatus: 'idle',
  eventsError: null,
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.eventsStatus = 'loading';
        state.eventsError = null; // Clear any previous errors
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<IEvent[]>) => {
        state.eventsStatus = 'succeeded';
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.eventsStatus = 'failed';
        state.eventsError = action.error; // Keep the full error object
      })
  },
})


// Selectors
const selectEventsState = (state: { events: EventsState }) => state.events;

export const selectEvents = createSelector(
    selectEventsState,
  (state) => state.events
);

export const selectEventsStatus = createSelector(
    selectEventsState,
  (state) => state.eventsStatus
);

export const selectEventsError = createSelector(
    selectEventsState,
  (state) => state.eventsError
);


export default eventsSlice.reducer
