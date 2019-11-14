const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require(`express-session`);
const User = require('../models/User');

const router = express.Router();


router.get('/login', (req,res)=>res.render('login'));
router.get('/register', (req,res)=>res.render('register'));

router.post('/register', (req, res)=>{
    const { fullname, email, username, password, password2 } = req.body;
    let errors = [];

    if(!fullname || !email || !username || !password || !password2 ){
        errors.push({msg: `Please fill all the required fields`});
    }
    if(password.length < 6){
        errors.push({msg: `Password needs to be atleast 6 charecters`});
    }
    if(password != password2){
        errors.push({msg:`Passwords do not match`});
    }
    
    if(errors.length > 0){

        res.render(`register`,{
            errors,
            fullname,
            email,
            username,
            password,
            password2
        });
    }
    else{
        
        User.findOne({$and:[{email: email},{username: username}]})
        .then(user=>{
            if(user){
                errors.push({msg:`Email or Username already exists`});
                res.render('register',{
                    errors,
                    fullname,
                    email,
                    username,
                    password,
                    password2
                });

            }else{
                const newUser = new User({
                    fullname,
                    email,
                    username,
                    password
                });
                if(req.body.isadmin === '1secretcodeforadmin51327'){
                    newUser.isadmin = true;
                }
                bcrypt.genSalt(10, (err,salt)=> bcrypt.hash(newUser.password,salt,(err,hash)=>{

                    if(err) throw err;
                    newUser.password=hash;

                    newUser.save()
                    .then(reguser =>{
                        req.flash(`success_msg`,`You are now registered and you're ready to login`);
                    res.redirect('/users/login');
                    })
                    .catch(err=>console.log(err));
                } ))
            }
        })
    }
    

});

module.exports = router;

router.post(`/login`,(req,res,next)=>{
    passport.authenticate('useru',{
        successRedirect: '/home',
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    req.session.destroy();
    res.redirect('/');
    
  });