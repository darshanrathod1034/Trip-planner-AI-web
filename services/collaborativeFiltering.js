import _ from "lodash";
import Review from "../models/Review.js";
import place from "../models/place.js";

/**
 * Recommend places using Collaborative Filtering
 * @param {String} userId - The user ID
 */
 const getUserBasedRecommendations = async (userId) => {
  try {
    // Get all reviews
    const allReviews = await Review.find().populate("placeId");

    // Group reviews by user
    const userRatings = _.groupBy(allReviews, "userId");

    // Find similar users (users who rated similar places)
    let similarUsers = [];
    for (let [otherUser, reviews] of Object.entries(userRatings)) {
      if (otherUser !== userId) {
        const commonPlaces = reviews.filter((r) =>
          userRatings[userId]?.some((ur) => ur.placeId._id.equals(r.placeId._id))
        );

        if (commonPlaces.length > 0) {
          similarUsers.push({ userId: otherUser, commonPlaces });
        }
      }
    }

    // Sort by most common places
    similarUsers = _.sortBy(similarUsers, (u) => -u.commonPlaces.length);

    // Recommend places that similar users liked
    let recommendedPlaces = [];
    for (let similarUser of similarUsers) {
      for (let review of userRatings[similarUser.userId]) {
        if (
          review.rating >= 4 && // Only recommend highly rated places
          !userRatings[userId]?.some((ur) => ur.placeId._id.equals(review.placeId._id))
        ) {
          recommendedPlaces.push(review.placeId);
        }
      }
    }

    return _.uniqBy(recommendedPlaces, "_id"); // Remove duplicates
  } catch (error) {
    console.error("Error in Collaborative Filtering:", error);
    return [];
  }
};
export default getUserBasedRecommendations;