import express from "express";
import  getHybridRecommendations  from "../services/hybridRecommendation.js";

const airouters = express.Router();

// Recommend places using Hybrid AI System
airouters.get("/recommend/:userId/:placeId", async (req, res) => {
  try {
    const { userId, placeId } = req.params;
    const recommendations = await getHybridRecommendations(userId, placeId);
    
    res.json({ success: true, recommendations });
  } catch (error) {
    console.error("Error in Recommendations API:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//export { router };

export default airouters;