const express = require('express');
const {createMovie, getMovies, moviesByCinema, movieById, isPoster, deleteMovie, updateMovie, singleMovie} = require('../controllers/movie');
const {requireCinemaSignin, cinemaById} = require('../controllers/cinema');
const validator = require('../validator/index');

const router = express.Router();

router.post("/movie/new/:cinemaId",requireCinemaSignin,  createMovie, validator.createMovieValidator);
router.get("/movies", getMovies);
router.get("/movies/by/:cinemaId",requireCinemaSignin, moviesByCinema)
router.get('/movie/:movieId', singleMovie);
router.put("/movie/:movieId",requireCinemaSignin, isPoster, updateMovie)
router.delete("/movie/:movieId",requireCinemaSignin, isPoster, deleteMovie)
router.param("cinemaId", cinemaById);
router.param("movieId", movieById);



module.exports = router;

