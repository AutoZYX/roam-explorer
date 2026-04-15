// Static geocoding lookup for cities in the ROAM dataset.
// Keeps map view zero-API-cost by avoiding runtime geocoding.

export const CITY_COORDS: Record<string, [number, number]> = {
  // California Bay Area
  "San Francisco": [37.7749, -122.4194],
  "Mountain View": [37.3861, -122.0839],
  "Palo Alto": [37.4419, -122.143],
  "San Jose": [37.3382, -121.8863],
  "Santa Clara": [37.3541, -121.9552],
  "Sunnyvale": [37.3688, -122.0363],
  "San Mateo": [37.5629, -122.3255],
  "Milpitas": [37.4323, -121.8996],
  "Los Altos": [37.3852, -122.1141],
  "Fremont": [37.5485, -121.9886],
  "San Bruno": [37.6305, -122.411],
  "Redwood City": [37.4852, -122.2364],
  "Foster City": [37.5585, -122.2711],
  "Brisbane": [37.6805, -122.4006],
  "South San Francisco": [37.6547, -122.4077],
  // Southern California
  "Los Angeles": [34.0522, -118.2437],
  "Santa Monica": [34.0195, -118.4912],
  "Culver City": [34.0211, -118.3965],
  "Venice": [33.9897, -118.4695],
  "Inglewood": [33.9617, -118.3531],
  "Long Beach": [33.7701, -118.1937],
  "Irvine": [33.6846, -117.8265],
  "Santa Fe Springs": [33.9472, -118.0853],
  // Arizona
  "Phoenix": [33.4484, -112.074],
  // Texas
  "Austin": [30.2672, -97.7431],
  "Houston": [29.7604, -95.3698],
  // China
  "Wuhan": [30.5928, 114.3055],
  "Beijing": [39.9042, 116.4074],
  "Shanghai": [31.2304, 121.4737],
  "Guangzhou": [23.1291, 113.2644],
  // Catch-alls
  "California": [36.7783, -119.4179],
};

export function normalizeCity(cityRaw: string): string {
  return cityRaw
    .replace(/,.*$/, "")
    .trim()
    .replace(/^SSn\s/i, "San ")
    .replace(/^Ssan\s/i, "San ")
    .replace(/^SANTA FE SPRINGS$/i, "Santa Fe Springs")
    .replace(/^LONG BEACH$/i, "Long Beach")
    .replace(/Francsico/i, "Francisco")
    .replace(/\s+/g, " ");
}

export function geocode(cityRaw: string): [number, number] | null {
  const normalized = normalizeCity(cityRaw);
  if (CITY_COORDS[normalized]) return CITY_COORDS[normalized];
  // Case-insensitive fallback
  const lower = normalized.toLowerCase();
  for (const [k, v] of Object.entries(CITY_COORDS)) {
    if (k.toLowerCase() === lower) return v;
  }
  return null;
}
