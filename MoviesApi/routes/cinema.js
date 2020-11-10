const express = require('express');
const {createCinema,getCinemas, cinemaSignin, cinemaSignout, cinemaById, updateCinema} = require('../controllers/cinema');

const router = express.Router();

router.post("/cinema-signup", createCinema);
router.get("/cinemas", getCinemas);
router.post("/cinema-signin", cinemaSignin);
router.get("/cinema-signout", cinemaSignout);
router.param('cinemaId', cinemaById);

module.exports = router;