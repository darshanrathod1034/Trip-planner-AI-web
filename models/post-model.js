import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  userid: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', // ✅ Matches user model name
    required: true 
  },
  image: { type: Buffer }, 
  picture: { type: String }, 
  likes: { type: Number, default: 0 },
  comments: [{
    userid: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'users', // ✅ Matches user model name
      required: true 
    },
    comment: { type: String, required: true }
  }]
}, { timestamps: true });

const postModel = mongoose.model('post', postSchema);  // ✅ Keep as 'posts'
export default postModel;
