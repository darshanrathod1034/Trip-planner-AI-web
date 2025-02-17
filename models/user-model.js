import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    posts: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'posts'
    },
    contact: Number
});

// ✅ Use ES module export
const userModel = mongoose.model('users', userSchema);
export default userModel;