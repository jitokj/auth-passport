var express = require('express');
var router = express.Router();
var User = require('../models/user');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

//get register page

router.get('/register',(req,res)=>{
res.render('register');
});

//get login page

router.get('/login',(req,res)=>{
    res.render('login');
    });

//submitting register form

router.post('/register',(req,res)=>{
        var name = req.body.name;
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var password2= req.body.password2;
 
        //validation
        req.checkBody('name','Name is required').notEmpty();
        req.checkBody('email','E-mail is required').notEmpty();
        req.checkBody('email','E-mail is not valid').isEmail();
        req.checkBody('username','UserName is required').notEmpty();
        req.checkBody('password','password is required').notEmpty();
        req.checkBody('password2','Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();

        if(errors){
               
            res.render('register',{
            errors: errors
            });
        }
        else
        {
          var newuser = new User ({
            name: name,
            username:username,
            email: email,
            password: password
          });
          User.createUser(newuser,(err, user)=>{
            if(err) throw err;
            console.log(user);
          });
          req.flash('success_msg','Registration successfull,login now');
          res.redirect('/users/login');
        }


        });   


        passport.use(new localStrategy(
          function(username, password, done) {
           User.getUserByUsername(username,(err, user)=>{
             if(err) throw err;
             if(!user){
               return done(null,false,{ message: 'unknow user'});
             }
             User.comparePassword(password,user.password,(err, isMatch)=>{
               if(err) throw err;
               if(isMatch){
                 return done(null,user);
               }
               else{
                 return done(null,false, { message:'Invlaid Password'});
               }
             });
           });
            }));
          
         passport.serializeUser((user,done)=>{
           done(null,user.id);
         });

         passport.deserializeUser((id,done)=>{
             User.getUserById(id,(err,user)=>{
               done(err,user);
             });
         });

        router.post('/login', passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/users/login',failureFlash: true,successFlash: true }),
       (req,res)=>{
         res.redirect('/');
       });
       
    router.get('/logout',(req,res)=>{
      req.logout();
      req.flash('success_msg','successfully logged out');
      res.redirect('/users/login');
    })   
    



module.exports = router;