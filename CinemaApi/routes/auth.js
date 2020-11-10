const express = require('express');
const {signup, signin, signout, accountActivation} = require('../controllers/auth');
const {userSignupValidator} = require('../validator/index');

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/account-activation", accountActivation);
router.post("/signin", signin);
router.get("/signout", signout);
module.exports = router;
