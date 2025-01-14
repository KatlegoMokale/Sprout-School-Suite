import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { IStudentFeesSchema } from '@/lib/utils'

export const fetchSchoolFees = createAsyncThunk('schoolFees/fetchSchoolFees', async () => {
  try {
    const response = await fetch('/api/student-school-fees');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as IStudentFeesSchema[];
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Error fetching schoolFees:', error);
    throw error; // Re-throw the error to be handled by rejected case
  }
})

interface SchoolFeesState {
  schoolFees: IStudentFeesSchema[];
  schoolFeesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  schoolFeesError: SerializedError | null;
}

const initialState: SchoolFeesState = {
  schoolFees: [],
  schoolFeesStatus: 'idle',
  schoolFeesError: null,
}

const schoolFeesSlice = createSlice({
  name: 'schoolFees',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolFees.pending, (state) => {
        state.schoolFeesStatus = 'loading';
        state.schoolFeesError = null; // Clear any previous errors
      })
      .addCase(fetchSchoolFees.fulfilled, (state, action: PayloadAction<IStudentFeesSchema[]>) => {
        state.schoolFeesStatus = 'succeeded';
        state.schoolFees = action.payload;
      })
      .addCase(fetchSchoolFees.rejected, (state, action) => {
        state.schoolFeesStatus = 'failed';
        state.schoolFeesError = action.error; // Keep the full error object
      })
  },
})


// Selectors
const selectSchoolFeesState = (state: { schoolFees: SchoolFeesState }) => state.schoolFees;

export const selectSchoolFees = createSelector(
    selectSchoolFeesState,
  (state) => state.schoolFees
);

export const selectSchoolFeesStatus = createSelector(
    selectSchoolFeesState,
  (state) => state.schoolFeesStatus
);

export const selectSchoolFeesError = createSelector(
    selectSchoolFeesState,
  (state) => state.schoolFeesError
);


export default schoolFeesSlice.reducer
