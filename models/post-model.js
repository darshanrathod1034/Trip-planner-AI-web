import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  userid: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', // Ensure it matches your User model name
    required: true 
  },
  image: { type: Buffer }, // Optional, used for storing image in DB
  picture: { type: String }, // Optional, used for image URL
  likes: { type: Number, default: 0 },
  comments: [{
    userid: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'users', // Ensure it matches your User model name
      required: true 
    },
    comment: { type: String, required: true }
  }]
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

const postModel = mongoose.model('Posts', postSchema);
export default postModel;
