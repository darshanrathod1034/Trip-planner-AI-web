import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating 1-5
  visitedAt: { type: Date, default: Date.now },
});

//export default mongoose.model("Review", ReviewSchema);
const reviewModel = mongoose.model("Review", ReviewSchema);
export default reviewModel;