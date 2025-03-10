import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//import userModel from '../models/user-model.js'; // Ensure correct file path
import userModel from '../models/user-model.js'; // Adjust the path as necessary
import postModel from '../models/post-model.js'; // Ensure correct file path
import multer from 'multer';
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

import isLoggedIn from '../middlewares/isloggedin.js';

const userRouter = express.Router();

// Users Page Route
userRouter.get('/', (req, res) => {
  res.send('Users page is loaded');
});

// User Registration
userRouter.post('/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).send('All input is required');
    }



    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign({ id: newUser._id, email }, 'highhook', { expiresIn: '1h' });

    // Send token as cookie
    res.cookie('token', token, { httpOnly: true });
    res.status(201).send('User created');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// User Login
userRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('All input is required');
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send('Email or password incorrect');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Email or password incorrect');
    }

    // Generate token
    const token = jwt.sign({ id: user._id, email }, 'highhook', { expiresIn: '1h' });

    // Send token as cookie
    res.cookie('token', token, { httpOnly: true }).send('You are logged in');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "trip_planner_posts", // Your folder name in Cloudinary
    format: async () => "jpg", // Change format if needed
    public_id: (req, file) => file.originalname.split(".")[0] // Use original filename
  }
});

const upload = multer({ storage });

// Updated Route to Upload Image & Store Cloudinary URL
userRouter.post("/createpost", isLoggedIn, upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    let user = await userModel.findOne({ email: req.user.email });

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    let post = new postModel({
      name,
      description,
      userid: user._id,
      picture: req.file.path // Cloudinary URL
    });

    user.post.push(post._id);
    await post.save();
    await user.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.get('/myposts',isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email }).populate('post');
    res.status(200).json({ post: user.post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.get('/allposts', async (req, res) => {
  try {
    let posts = await postModel.find();
    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.post('/likepost/:id',isLoggedIn, async (req, res) => {
  try {
    let post = await postModel.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.status(200).json({ message: "Post liked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.post('/addcomment/:id',isLoggedIn, async (req, res) => {
  try {
    let post = await postModel.findById(req.params.id);
    let user =await userModel.findOne({ email: req.user.email });
    post.comments.push({ userid: user._id, comment: req.body.comment });
    await post.save();
    //await user.save();
    res.status(200).json({ message: "Comment added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }});


// User Logout
userRouter.post('/logout', (req, res) => {
  res.clearCookie('token').send('You are logged out');
});

export default userRouter; // ✅ Use ES module export
