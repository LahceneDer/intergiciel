exports.userSignupValidator = (req, res, next) => {
    // name is not null and between 4-20 char
    req.check("name","Name is required").notEmpty();
    // email is not null, valid and normalized
    req.check("email","Email must be netween 3 and 32 chars")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must be valid")
    .isLength({min:4, max:100})

    // check for password
    req.check("password", "Password is required").notEmpty();
    req.check("password")
    .isLength({min:6})
    .withMessage("Password must be contain at least 6 char")
    .matches(/\d/)
    .withMessage("Password must contain a number")

    // check for errors 
    const errors = req.validationErrors();
    // if the error show the first one they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError});
    }
    //process to next middleware
    next();
}

exports.createMovieValidator = (req, res, next) => {
    // title
    req.check('title', 'Write a title').notEmpty();
    req.check('title', 'Title must be between 4 to 150 characters').isLength({
        min: 4,
        max: 150
    });
    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();
};