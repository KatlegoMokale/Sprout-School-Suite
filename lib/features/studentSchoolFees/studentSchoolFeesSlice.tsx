import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { IStudentFeesSchema } from '@/lib/utils'

export const fetchStudentSchoolFees = createAsyncThunk('studentSchoolFees/fetchStudentSchoolFees', async () => {
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

interface StudentSchoolFeesState {
  studentSchoolFees: IStudentFeesSchema[];
  studentSchoolFeesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  studentSchoolFeesError: SerializedError | null;
}

const initialState: StudentSchoolFeesState = {
  studentSchoolFees: [],
  studentSchoolFeesStatus: 'idle',
  studentSchoolFeesError: null,
}

const studentSchoolFeesSlice = createSlice({
  name: 'studentSchoolFees',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentSchoolFees.pending, (state) => {
        state.studentSchoolFeesStatus = 'loading';
        state.studentSchoolFeesError = null; // Clear any previous errors
      })
      .addCase(fetchStudentSchoolFees.fulfilled, (state, action: PayloadAction<IStudentFeesSchema[]>) => {
        state.studentSchoolFeesStatus = 'succeeded';
        state.studentSchoolFees = action.payload;
      })
      .addCase(fetchStudentSchoolFees.rejected, (state, action) => {
        state.studentSchoolFeesStatus = 'failed';
        state.studentSchoolFeesError = action.error; // Keep the full error object
      })
  },
})


// Selectors
const selectStudentSchoolFeesState = (state: { studentSchoolFees: StudentSchoolFeesState }) => state.studentSchoolFees;

export const selectStudentSchoolFees = createSelector(
    selectStudentSchoolFeesState,
  (state) => state.studentSchoolFees
);

export const selectStudentSchoolFeesStatus = createSelector(
    selectStudentSchoolFeesState,
  (state) => state.studentSchoolFeesStatus
);

export const selectSchoolFeesError = createSelector(
    selectStudentSchoolFeesState,
  (state) => state.studentSchoolFeesError
);


export default studentSchoolFeesSlice.reducer
