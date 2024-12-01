import { configureStore } from '@reduxjs/toolkit'
import studentsReducer from './features/students/studentsSlice'
import classesReducer  from './features/classes/classesSlice'



const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('reduxState', serializedState)
  } catch {
    // Ignore write errors
  }
}
const preloadedState = loadState()

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    // staff: staffReducer,
     classes: classesReducer,
  },
})

store.subscribe(() => {
  saveState(store.getState())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch