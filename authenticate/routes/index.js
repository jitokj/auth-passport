var express = require('express');
var router = express.Router();

//get homepage

router.get('/',authenticated,(req,res)=>{
res.render('index');
});

function authenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
   else{
       
       res.redirect('/users/login');
   }
}




module.exports = router;