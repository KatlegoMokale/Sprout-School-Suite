import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { IClass } from '@/lib/utils'

export const fetchClasses = createAsyncThunk('classes/fetchClasses', async () => {
  try {
    const response = await fetch('/api/class');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as IClass[];
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Error fetching classes:', error);
    throw error; // Re-throw the error to be handled by rejected case
  }
})

interface ClassesState {
  classes: IClass[];
  classesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  classesError: SerializedError | null;
}

const initialState: ClassesState = {
  classes: [],
  classesStatus: 'idle',
  classesError: null,
}

const classessSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.classesStatus = 'loading';
        state.classesError = null; // Clear any previous errors
      })
      .addCase(fetchClasses.fulfilled, (state, action: PayloadAction<IClass[]>) => {
        state.classesStatus = 'succeeded';
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.classesStatus = 'failed';
        state.classesError = action.error; // Keep the full error object
      })
  },
})


// Selectors
const selectClassesState = (state: { classes: ClassesState }) => state.classes;

export const selectClasses = createSelector(
    selectClassesState,
  (state) => state.classes
);

export const selectClassesStatus = createSelector(
    selectClassesState,
  (state) => state.classesStatus
);

export const selectClassesError = createSelector(
    selectClassesState,
  (state) => state.classesError
);


export default classessSlice.reducer
