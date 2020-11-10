const jwt = require("jsonwebtoken");
require("dotenv").config()
const User = require("../models/user");

const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' });

        const emailData = {
            from: "l.dergham@esi-sba.dz",
            to: email,
            subject: `Account activation link`,
            html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        };

        sgMail
            .send(emailData)
            .then(sent => {
                // console.log('SIGNUP EMAIL SENT', sent)
                return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                });
            })
            .catch(err => {
                // console.log('SIGNUP EMAIL SENT ERROR', err)
                return res.json({
                    message: err.message
                });
            });
    });
};


exports.accountActivation = (req, res) => {
    const { token } = req.body;

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if (err) {
                console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
                return res.status(401).json({
                    error: 'Expired link. Signup again'
                });
            }

            const { name, email, password } = jwt.decode(token);

            const user = new User({ name, email, password });

            user.save((err, user) => {
                if (err) {
                    console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
                    return res.status(401).json({
                        error: 'Error saving user in database. Try signup again'
                    });
                }
                return res.json({
                    message: 'Signup success. Please signin.'
                });
            });
        });
    } else {
        return res.json({
            message: 'Something went wrong. Try again.'
        });
    }
};


exports.signin = (req, res) => {
    // find the user based on email
    const {_id, name, email, password} = req.body
    // if error or no user
    User.findOne({email}, (err, user) => {
        // if eror or no user
        if(err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist, please try signin."
            })
        }
        // if user found make sure the email and password match
        // create authenticate method in model and use here
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password do not match."
            })
        }
        // generate a token with user id and secret
        const token = jwt.sign({id: user._id, role:user.role}, process.env.JWT_SECRET);
         // persist the token as 't' in cookie  with expiry date
        res.cookie('t', token, {expire: new Date() + 9999})
         // return response with user and token to frontend client 
         const {_id, name, email, role} = user;
         return res.json({ token, user: {_id, name, email, role} });
    })


 
}

exports.signout = (req, res) => {
   res.clearCookie('t');
   return res.json({message: "Signout success!"})
}