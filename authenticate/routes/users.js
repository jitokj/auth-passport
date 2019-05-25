var express = require('express');
var router = express.Router();

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
          console.log('successfull');
        }


        });   
    



module.exports = router;