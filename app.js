const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path=require('path');

const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const index=require('./routes/index');
const expresssession=require('express-session');
const flash=require('express-flash');

const app = express();
const PORT = 5555;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser()); // Use cookie parser if needed
app.use( expresssession ({
  resave:false, saveUninitialized:false, secret:'highhook', cookie:{maxAge:60000}})
);
app.use(flash());

// MongoDB Connection
//const MONGO_URI = "mongodb+srv://darshanvipulkumarrathod81:CXCEUeSjZotxBgtc@cluster0.zhso0.mongodb.net/your_database_name";


// Routes
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/',index);


mongoose.connect("mongodb://127.0.0.1:27017/tripplanner" )
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit if the connection fails
  });


// Routes
app.get('/', (req, res) => {
  res.send('<h1>WELCOME AI TRIP PLANNER </h1>');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
