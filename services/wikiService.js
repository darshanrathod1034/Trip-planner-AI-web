import axios from "axios";

export const getWikipediaDescription = async (placeName) => {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${placeName.replace(" ", "_")}`;
    const response = await axios.get(url);
    return response.data.extract || "No description available.";
  } catch (error) {
    console.error(`Wikipedia API Error for ${placeName}:`, error);
    return "No description available.";
  }
};
