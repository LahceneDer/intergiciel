const Movie = require('../models/movie');
const formidable = require('formidable');
const _ = require("lodash");
const fs = require('fs');

exports.movieById = (req, res, next, id) => {
    Movie.findById(id)
        .populate('postedBy', '_id name')
        .exec((err, movie) => {
            if (err || !movie) {
                return res.status(400).json({
                    error: err
                });
            }
            req.movie = movie;
            next();
        });
};

exports.getMovies = (req,res) => {
    const movies = Movie.find()
        .populate("postedBy", "_id name")
        .then(movies => {
            res.json({movies}); 
        })
        .catch( err => res.status(400).json({
            error: err
        }))
   /* Movie.find((err, movies) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({movies});
        
    }); */
};

exports.movieById = (req, res, next, id) => {
    Movie.findById(id)
    .populate("postedBy","_id name role")
    .exec((err, movie) => {
        if (err || !movie) {
            return res.status(400).json({
                error: err
            });
        }
        req.movie = movie;
        next();
    });
};

exports.singleMovie = (req, res) => {
    return res.json(req.movie);
};

exports.createMovie = (req,res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        let movie = new Movie(fields);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        movie.postedBy = req.profile;

        if (files.photo) {
            movie.photo.data = fs.readFileSync(files.photo.path);
            movie.photo.contentType = files.photo.type;
        }
        movie.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

exports.moviesByCinema = (req, res) => {
    Movie.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .sort('_created')
        .exec((err, movies) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(movies);
        });
};

exports.isPoster = (req, res, next) => {
    let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth.id;
    let adminUser = req.post && req.auth && req.auth.role === 'admin';

    /* console.log("req.movie ", req.movie, 
        "  \n \n --- req.auth ", req.auth, 
        "  \n \n --- req.movie.postedBy._id ", req.movie.postedBy._id, 
        "\n \n --- req.auth._id", req.auth.id
        
        );*/
    let isPoster = sameUser || adminUser;
    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
};

exports.updateMovie = (req, res, next) => {
        // save movie
        let movie = req.movie;
        movie = _.extend(movie, req.body);
        movie.updated = Date.now();
        movie.save(err => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(movie);
        });
};


exports.deleteMovie = (req, res) => {
    let movie = req.movie;
    movie.remove((err, movie) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Movie deleted successfully'
        });
    });
};