import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Students', 'Classes', 'Stuff', 'Groceries', 'Transactions', 'PettyCash', 'Events', 'StudentSchoolFees', 'SchoolFeesSetup'],
  endpoints: (builder) => ({
    // Students
    getStudents: builder.query({
      query: () => 'students',
      providesTags: ['Students'],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
    
    // Classes
    getClasses: builder.query({
      query: () => 'class',
      providesTags: ['Classes'],
      keepUnusedDataFor: 300,
    }),
    
    // Stuff
    getStuff: builder.query({
      query: () => 'stuff',
      providesTags: ['Stuff'],
      keepUnusedDataFor: 300,
    }),
    
    // Groceries
    getGroceries: builder.query({
      query: () => 'grocery',
      providesTags: ['Groceries'],
      keepUnusedDataFor: 300,
    }),
    
    // Transactions
    getTransactions: builder.query({
      query: () => 'transactions',
      providesTags: ['Transactions'],
      keepUnusedDataFor: 300,
    }),
    
    // PettyCash
    getPettyCash: builder.query({
      query: () => 'pettycash',
      providesTags: ['PettyCash'],
      keepUnusedDataFor: 300,
    }),
    
    // Events
    getEvents: builder.query({
      query: () => 'event',
      providesTags: ['Events'],
      keepUnusedDataFor: 300,
    }),
    
    // StudentSchoolFees
    getStudentSchoolFees: builder.query({
      query: () => 'student-school-fees',
      providesTags: ['StudentSchoolFees'],
      keepUnusedDataFor: 300,
    }),
    
    // SchoolFeesSetup
    getSchoolFeesSetup: builder.query({
      query: () => 'school-fees-setup',
      providesTags: ['SchoolFeesSetup'],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetClassesQuery,
  useGetStuffQuery,
  useGetGroceriesQuery,
  useGetTransactionsQuery,
  useGetPettyCashQuery,
  useGetEventsQuery,
  useGetStudentSchoolFeesQuery,
  useGetSchoolFeesSetupQuery,
} = api; 