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
    console.error('Error fetching students:', error);
    throw error;
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.studentStatus = 'loading';
        state.studentError = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<IStudent[]>) => {
        state.studentStatus = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.studentStatus = 'failed';
        state.studentError = action.error;
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

export const selectStudentById = createSelector(
  [selectStudents, (state, studentId: string) => studentId],
  (students, studentId) => students.find(student => student.$id === studentId)
);

export default studentsSlice.reducer