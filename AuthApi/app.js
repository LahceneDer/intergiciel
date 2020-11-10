const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const fs = require("fs");


app.use(express.json({extended: false}));

dotenv.config();



mongoose.connect(
        process.env.MONGO_URI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        
    )   
    .then(() => console.log("DB connected"))


mongoose.connection.on('error', err => {
    console.log(`DB connection error : ${err.message}`);
});
//bring in routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');





//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());
app.use("/", userRoutes);
app.use("/", authRoutes);

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized!, please Login as Cinema' });
    }
});

// api Docs
app.get('/', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});


const PORT = 8081;

app.listen(PORT , () => {
    console.log(`Our Node js API listening on port : ${PORT}`);
});
