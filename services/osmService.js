import axios from "axios";
import place from "../models/place.js";

const OVERPASS_URL = "http://overpass-api.de/api/interpreter";

export const fetchPlacesFromOSM = async (cityName) => {
  try {
    const query = `
    [out:json];
    area[name="${cityName}"]->.searchArea;
    (
      node["tourism"="attraction"](area.searchArea);
      node["amenity"="restaurant"](area.searchArea);
      node["amenity"="hotel"](area.searchArea);
    );
    out body;
    `;
    
    const response = await axios.get(OVERPASS_URL, { params: { data: query } });
    
    let places = response.data.elements.map((element) => ({
      name: element.tags?.name || "Unknown",
      lat: element.lat,
      lng: element.lon,
      type: element.tags?.tourism || element.tags?.amenity || "",
      city: cityName,
    }));

    await place.insertMany(places);
    console.log(`✅ Stored ${places.length} places in the database.`);
    return places;
    
  } catch (error) {
    console.error("Error fetching OSM places:", error);
  }
};