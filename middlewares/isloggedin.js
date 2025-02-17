import jwt from 'jsonwebtoken';
//import userModel from '../models/users-model.js';
//import userModel from '../models/users-model.js';
import userModel from '../models/user-model.js'; // Correct relative path

const isLoggedIn = async (req, res, next) => {
    if (!req.cookies.token) { 
      //  req.flash('error', 'Please login first');
        return res.redirect('/');
    }

    try {
        let decoded = jwt.verify(req.cookies.token, 'highhook');
        let user = await userModel.findOne({ email: decoded.email }).select('-password');

        req.user = user;
        next();
    } catch (error) {
       // req.flash('error', 'Please login first');
        return res.redirect('/');
    }
};

export default isLoggedIn;










