import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { ISchoolFees } from '@/lib/utils'


export const fetchSchoolFeesSetup = createAsyncThunk('schoolFeesSetup/fetchSchoolFeesSetup', async ()=>{
  try {
    const response = await fetch('/api/school-fees-setup');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as ISchoolFees[];
  } catch (error: any) {
    console.error('Error fetching schoolFeesSetup:', error);
    throw error;
  }
})

interface SchoolFeesSetupState {
  schoolFeesSetup: ISchoolFees[];
  schoolFeesSetupStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  schoolFeesSetupError: SerializedError | null;
}

const initialState: SchoolFeesSetupState = {
  schoolFeesSetup: [],
  schoolFeesSetupStatus: 'idle',
  schoolFeesSetupError: null,
}

const schoolFeesSetupSlice = createSlice({
  name: 'schoolFeesSetup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolFeesSetup.pending, (state) => {
        state.schoolFeesSetupStatus = 'loading';
        state.schoolFeesSetupError = null;
      })
      .addCase(fetchSchoolFeesSetup.fulfilled, (state, action: PayloadAction<ISchoolFees[]>) => {
        state.schoolFeesSetupStatus = 'succeeded';
        state.schoolFeesSetup = action.payload;
      })
      .addCase(fetchSchoolFeesSetup.rejected, (state, action) => {
        state.schoolFeesSetupStatus = 'failed';
        state.schoolFeesSetupError = action.error;
      })
  },
})

const selectSchoolFeesSetupState = (state: { schoolFeesSetup: SchoolFeesSetupState }) => state.schoolFeesSetup;

console.log("schoolFeesSetup ",selectSchoolFeesSetupState);

export const selectSchoolFeesSetup = createSelector(
  selectSchoolFeesSetupState,
  (schoolFeesSetupState) => schoolFeesSetupState.schoolFeesSetup
);

export const selectSchoolFeesSetupStatus = createSelector(
  selectSchoolFeesSetupState,
  (schoolFeesSetupState) => schoolFeesSetupState.schoolFeesSetupStatus
);

export const selectSchoolFeesSetupError = createSelector(
  selectSchoolFeesSetupState,
  (schoolFeesSetupState) => schoolFeesSetupState.schoolFeesSetupError
);


export default schoolFeesSetupSlice.reducer;







// export const fetchSchoolFeesSetup = createAsyncThunk('schoolFeesSetup/fetchSchoolFeesSetup', async () => {
//   try {
//     const response = await fetch('/api/school-fees-setup');
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
  
//     return (await response.json()) as ISchoolFees[];
//   } catch (error: any) {
//     // Log the full error for debugging
//     console.error('Error fetching schoolFeesSetup:', error);
//     throw error; // Re-throw the error to be handled by rejected case
//   }
// })

// interface SchoolFeesState {
//   schoolFees: ISchoolFees[];
//   schoolFeesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
//   schoolFeesError: SerializedError | null;
// }

// const initialState: SchoolFeesState = {
//   schoolFees: [],
//   schoolFeesStatus: 'idle',
//   schoolFeesError: null,
// }

// const schoolFeesSlice = createSlice({
//   name: 'schoolFees',
//   initialState,
//   reducers: {}, // Add reducers here if needed
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSchoolFeesSetup.pending, (state) => {
//         state.schoolFeesStatus = 'loading';
//         state.schoolFeesError = null; // Clear any previous errors
//       })
//       .addCase(fetchSchoolFeesSetup.fulfilled, (state, action: PayloadAction<ISchoolFees[]>) => {
//         state.schoolFeesStatus = 'succeeded';
//         state.schoolFees = action.payload;
//       })
//       .addCase(fetchSchoolFeesSetup.rejected, (state, action) => {
//         state.schoolFeesStatus = 'failed';
//         state.schoolFeesError = action.error; // Keep the full error object
//       })
//   },
// })


// // Selectors
// const selectStateSchoolFees = (state: { schoolFees: SchoolFeesState }) => state.schoolFees;

// export const selectSchoolFeesSetup = createSelector(
//   selectStateSchoolFees,
//   (state) => state.schoolFees
// );

// export const selectSchoolFeesSetupStatus = createSelector(
//   selectStateSchoolFees,
//   (state) => state.schoolFeesStatus
// );

// export const selectSchoolFeesSetupError = createSelector(
//   selectStateSchoolFees,
//   (state) => state.schoolFeesError
// );

// export const selectSchoolFeesById = createSelector(
//   [selectSchoolFeesSetup, (state, schoolFeesId: string) => schoolFeesId],
//   (schoolFees, schoolFeesId) => schoolFees.find(schoolFees => schoolFees.$id === schoolFeesId)
// );


// export default schoolFeesSlice.reducer
