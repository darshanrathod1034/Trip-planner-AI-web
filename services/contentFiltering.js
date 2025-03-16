import place from "../models/place.js";

/**
 * Recommend places based on content similarity
 * @param {String} placeId - The current place ID
 */
 const getContentBasedRecommendations = async (placeId) => {
  try {
    const targetPlace = await place.findById(placeId);
    if (!targetPlace) return [];

    // Find places with similar type (e.g., all "beaches" or "hotels")
    const similarPlaces = await place.find({ type: targetPlace.type }).limit(5);

    return similarPlaces;
  } catch (error) {
    console.error("Error in Content-Based Filtering:", error);
    return [];
  }
};
export default getContentBasedRecommendations;