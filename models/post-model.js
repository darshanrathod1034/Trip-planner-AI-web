import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  userid: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Ensure it matches your User model name
    required: true 
  },
  image: { type: Buffer }, // Optional, used for storing image in DB
  picture: { type: String }, // Optional, used for image URL
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

const postModel = mongoose.model('Post', postSchema);
export default postModel;
