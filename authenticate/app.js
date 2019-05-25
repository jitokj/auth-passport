var express = require('express');
var path = require("path");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth',{useNewUrlParser: true });
var db = mongoose.connection;


var routes  = require('./routes/index');
var users = require('./routes/users');

//initialising app
var app = express();

//view engine setup
app.set("views", path.join(__dirname,'views'));
app.engine('hbs', exphbs({extname: 'hbs', defaultLayout: 'layout'}));
app.set("view engine", 'hbs');

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//static folder
app.use(express.static(path.join(__dirname, 'public')));


//Express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//passport init

app.use(passport.initialize());
app.use(passport.session());

//Express validator

app.use(expressValidator({
    errorFormatter: function(param,msg,value){
        var nameSpace = param.split('.')
        , root = nameSpace.shift()
        , formParam = root;
        
        while(nameSpace.length){
            formParam += '[' + nameSpace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }}));

 //Flash messages
 
 app.use(flash());

 //global variables

 app.use(function(req,res,next){
     res.locals.sucess_msg = req.flash('sucess_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error = req.flash('error');
     next();
 });

 app.use('/',routes);
 app.use('/users',users);

 //set Port

 app.set('port', (process.env.PORT || 3000));

 app.listen(app.get('port'),function(){
  console.log('server started on port ' + app.get('port'));
 });

