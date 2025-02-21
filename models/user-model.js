import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    post: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'posts'
    }],
    phone: Number
});

// ✅ Use ES module export
const userModel = mongoose.model('users', userSchema);
export default userModel;