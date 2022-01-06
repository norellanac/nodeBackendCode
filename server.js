const express = require('express'); 
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');

const users = require ('./routes/api/users');
const messages = require ('./routes/api/messages');

const app=  express();
//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;
const passport = require('passport');
//$ docker run --name some-mongo -d mongo:tag 
//connect mongodb
mongoose.connect(db)
.then(()=> console.log("mongo db connected"))
.catch(err => console.log("mongo error: ", err));
app.get('/', (req, res) => res.send('Hey U'));


//passport middleware
app.use(passport.initialize());

//passport Config
require('./config/passport')(passport);


//Use Routes
app.use('/', users);
app.use('/', messages);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port  ${port}`))