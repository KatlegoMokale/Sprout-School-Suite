export interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

export const sedibengAreas = [
  "Vanderbijlpark",
  "Sebokeng",
  "Bedworth Park",
  "Sharpeville",
  "Tshepiso",
  "Boipatong",
  "Bophelong"
];

export const commonStreets = {
  Vanderbijlpark: [
    "Church Street",
    "Hendrik Van Eck Boulevard",
    "Frikkie Meyer Boulevard",
    "Voortrekker Street",
    "President Street",
    "Market Street",
    "Van Riebeeck Street",
    "Nelson Mandela Drive"
  ],
  Sebokeng: [
    "Zone 1",
    "Zone 2",
    "Zone 3",
    "Zone 4",
    "Zone 5",
    "Zone 6",
    "Zone 7",
    "Zone 8",
    "Zone 9",
    "Zone 10",
    "Zone 11",
    "Zone 12",
    "Zone 13",
    "Zone 14",
    "Zone 15",
    "Zone 16",
    "Zone 17"
  ],
  "Bedworth Park": [
    "Bedworth Street",
    "Park Street",
    "Main Road",
    "Church Street",
    "School Street"
  ],
  Sharpeville: [
    "Vereeniging Road",
    "Station Road",
    "Main Road",
    "Church Street",
    "School Street"
  ],
  Tshepiso: [
    "Phase 1",
    "Phase 2",
    "Phase 3",
    "Phase 4",
    "Phase 5",
    "Phase 6",
    "Phase 7"
  ],
  Boipatong: [
    "Section A",
    "Section B",
    "Section C",
    "Section D",
    "Section E",
    "Section F"
  ],
  Bophelong: [
    "Section A",
    "Section B",
    "Section C",
    "Section D",
    "Section E",
    "Section F"
  ]
};

export async function getAddressSuggestions(input: string): Promise<AddressSuggestion[]> {
  if (!input) return [];

  try {
    // Add "Sedibeng District" to the search query to focus results
    const query = `${input}, Sedibeng District, South Africa`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'DaycareDashboard/1.0' // Required by Nominatim's terms of service
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address suggestions');
    }

    const data = await response.json();
    
    // Transform the data to match our interface
    return data.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
      type: item.type
    }));
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
}

const searchAddress = async (query: string) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
  );
  return response.json();
}; 