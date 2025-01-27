// 'use client'

// import React, { useState, useEffect } from 'react';
// import { debounce } from 'lodash';

// interface Place {
//   Place: {
//     Label: string;
//     Geometry: {
//       Point: [number, number];
//     };
//   };
// }

// const AddressSearch: React.FC = () => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<Place[]>([]);

//   const searchPlaces = async (input: string) => {
//     if (input.length < 3) return;

//     try {
//       const response = await fetch(`/api/search-places?q=${encodeURIComponent(input)}`);
//       if (!response.ok) throw new Error('Failed to fetch');
//       const data = await response.json();
//       setResults(data);
//     } catch (error) {
//       console.error('Error fetching places:', error);
//     }
//   };

//   const debouncedSearchPlaces = debounce(searchPlaces, 300);

//   useEffect(() => {
//     debouncedSearchPlaces(query);
//     return () => {
//       debouncedSearchPlaces.cancel();
//     };
//   }, [query]);

//   const handleSelect = (place: Place) => {
//     console.log('Selected place:', place);
//     // Handle the selected place (e.g., update form, navigate to map, etc.)
//   };

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search for an address"
//         className="w-full p-2 border rounded"
//       />
//       {results.length > 0 && (
//         <ul className="absolute z-10 w-full bg-white border rounded mt-1">
//           {results.map((result, index) => (
//             <li
//               key={index}
//               onClick={() => handleSelect(result)}
//               className="p-2 hover:bg-gray-100 cursor-pointer"
//             >
//               {result.Place.Label}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AddressSearch;

