import express from "express";
import { fetchPlacesFromOSM } from "../services/osmService.js";
import { getWikipediaDescription } from "../services/wikiService.js";
import place from "../models/place.js";

const placeRouter = express.Router();

// Fetch places from OpenStreetMap & Wikipedia
placeRouter.get("/fetch/:city", async (req, res) => {
  try {
    const city = req.params.city;
    let places = await fetchPlacesFromOSM(city);

    // Fetch Wikipedia descriptions for each place
    for (let place of places) {
      place.description = await getWikipediaDescription(place.name);
    }

    await place.insertMany(places);
    res.json({ success: true, data: places });
  } catch (error) {
    console.error("Error in fetching places:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all stored places
placeRouter.get("/", async (req, res) => {
  try {
    const places = await place.find();
    res.json(places);
  } catch (error) {
    console.error("Error fetching stored places:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default placeRouter;
