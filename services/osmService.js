import axios from "axios";
import place from "../models/place.js";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export const fetchPlacesFromOSM = async (cityName) => {
  try {
    const response = await axios.get(NOMINATIM_URL, {
      params: {
        q: cityName,  // Search city
        format: "json",
        addressdetails: 1,
        limit: 50,  // Get top 10 places
      },
    });

    let places = response.data.map((place) => ({
      name: place.display_name,
      lat: place.lat,
      lng: place.lon,
      type: place.type,
      city: cityName,
    }));

    console.log(`✅ Found ${places.length} places in ${cityName}`);
    return places;
  } catch (error) {
    console.error("❌ Error fetching places:", error);
    return [];
  }
};