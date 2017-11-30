var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");


//root route
router.get("/", function(req, res){
    res.render("landing");
});


//===========
//AUTH ROUTES
//===========

// //show register form
// router.get("/register", function(req, res){
//   res.render("register"); 
   
// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "You created a new acount");
           res.redirect("/cats"); 
        });
    });
})

// // show login form
// router.get("/login", function(req, res){
//     res.render("login");
// });

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/cats",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("error", "You were logged out");
   res.redirect("/cats");
});



module.exports = router;