const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require('express-jwt'); 
const Cinema = require("../models/cinema");

exports.getCinemas = (req,res) => {
    Cinema.find((err, cinemas) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({cinemas});
        
    });
};

exports.cinemaById = (req, res, next, id) => {
    Cinema.findById(id)
    // populate followers and following users array
    .exec((err, cinema) => {
        if (err || !cinema) {
            return res.status(400).json({
                error: 'Cinema not found'
            });
        }
        req.profile = cinema; // adds profile object in req with user info
        next();
    });
}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id;

    if (!authorized) {
        return res.status(403).json({
            error: 'User is not authorized to perform this action'
        });
    }
    next();
};


exports.createCinema = async (req, res) => {
    const cinemaExists = await Cinema.findOne({email: req.body.email})
    if(cinemaExists) return res.status(403).json({
        error : "Email is taken"
    })

    const cinema = await new Cinema(req.body)
    await cinema.save()
    res.status(200).json({message: "Cinema Creation successfully! Please login as Cinema."})
}

exports.cinemaSignin = (req, res) => {
    // find the user based on email
    const {_id, name, email, password} = req.body
    // if error or no user
    Cinema.findOne({email}, (err, cinema) => {
        // if eror or no user
        if(err || !cinema) {
            return res.status(401).json({
                error: "Cinema with that email does not exist, please try signin."
            })
        }
        // if user found make sure the email and password match
        // create authenticate method in model and use here
        if(!cinema.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password do not match."
            })
        }
        // generate a token with user id and secret
        const token = jwt.sign({id: cinema._id}, process.env.JWT_SECRET);
         // persist the token as 't' in cookie  with expiry date
        res.cookie('t', token, {expire: new Date() + 9999})
         // return response with user and token to frontend client 
         const {_id, name, email} = cinema;
         return res.json({ token, cinema: {_id, name, email} });
    })
};


exports.cinemaSignout = (req, res) => {
    res.clearCookie('t');
    return res.json({message: "Signout success!"});
 };

 exports.requireCinemaSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
});

