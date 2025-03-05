import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  type: { type: String, required: true }, // hotel, restaurant, attraction
  city: { type: String, required: true },
  description: { type: String },
});

//export default mongoose.model("Place", placeSchema);

const placeModel = mongoose.model('place', placeSchema);
export default placeModel;
