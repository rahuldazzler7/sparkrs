const express = require('express');
const flash = require(`connect-flash`);
const session = require(`express-session`);
const mongoose = require('mongoose');
const passport = require('passport');


const app = express();

require(`./config/passport`)(passport);

const db = require('./config/keys').MongoURI;

mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })
.then(()=> console.log(`MongoDB connected...`))
.catch(err => console.log(err));

app.use(express.urlencoded({ extended : false}));

  //Express Session
app.use(
  session({
    secret: 'Rahulsecret',
    resave: true,
    saveUninitialized: true
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());  

app.use(flash());

app.use(function(req, res, next) { 
  res.locals.currentuser = req.user;
  res.locals.login = req.isAuthenticated();
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});




app.use(express.static("./public/"));
app.use('/loginstf', express.static('statics/loginstf'));
app.set('view engine', 'ejs');


app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`Server started on ${PORT}`));