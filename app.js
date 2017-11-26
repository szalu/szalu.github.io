var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");
var seedDB      = require("./seeds");
var passport    = require("passport");
var LocalStrategy = require("passport-local");
var User        = require("./models/user");
var methodOverride = require("method-override");
var flash       = require("connect-flash");

//requring routes
var commentRoutes       = require("./routes/comments");
var campgroundRoutes    = require("./routes/campgrounds");
var indexRoutes         = require("./routes/index");


console.log(process.env.DATABASEURL);

mongoose.connect("process.env.DATABASEURL", {useMongoClient: true});
// mongoose.connect("mongodb://lukasz:cat@ds121716.mlab.com:21716/yelpcamp", {useMongoClient: true});
process.env.databaseURL

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database


//Passport configuration
app.use(require("express-session")({
    secret: "I am the bone of my sword",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//add currentUser to all templates, routes
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp has started"); 
});

