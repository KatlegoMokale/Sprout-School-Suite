import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { IStudent } from '@/lib/utils'

export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
  try {
    const response = await fetch('/api/students');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as IStudent[];
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Error fetching students:', error);
    throw error; // Re-throw the error to be handled by rejected case
  }
})

interface StudentsState {
  students: IStudent[];
  studentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  studentError: SerializedError | null;
}

const initialState: StudentsState = {
  students: [],
  studentStatus: 'idle',
  studentError: null,
}

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {}, // Add reducers here if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.studentStatus = 'loading';
        state.studentError = null; // Clear any previous errors
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<IStudent[]>) => {
        state.studentStatus = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.studentStatus = 'failed';
        state.studentError = action.error; // Keep the full error object
      })
  },
})


// Selectors
const selectStudentsState = (state: { students: StudentsState }) => state.students;

export const selectStudents = createSelector(
  selectStudentsState,
  (state) => state.students
);

export const selectStudentsStatus = createSelector(
  selectStudentsState,
  (state) => state.studentStatus
);

export const selectStudentsError = createSelector(
  selectStudentsState,
  (state) => state.studentError
);


export default studentsSlice.reducer
