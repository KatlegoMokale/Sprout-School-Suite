import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './features/api/apiSlice'
import studentsReducer from './features/students/studentsSlice'
import classesReducer from './features/classes/classesSlice'
import groceryReducer from './features/grocery/grocerySlice'
import stuffReducer from './features/stuff/stuffSlice'
import transactionReducer from './features/transactions/transactionsSlice'
import pettyCashReducer from './features/pettyCash/pettyCashSlice'
import eventsReducer from './features/events/eventsSlice'
import studentSchoolFeesReducer from './features/studentSchoolFees/studentSchoolFeesSlice'
import schoolFeesSetupReducer from './features/schoolFeesSetup/schoolFeesSetupSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    students: studentsReducer,
    stuff: stuffReducer,
    classes: classesReducer,
    groceries: groceryReducer,
    transactions: transactionReducer,
    pettyCash: pettyCashReducer,
    events: eventsReducer,
    studentSchoolFees: studentSchoolFeesReducer,
    schoolFeesSetup: schoolFeesSetupReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch