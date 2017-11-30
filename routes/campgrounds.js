var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dwy0eb4sq', 
  api_key: 123738186374385, 
  api_secret: "LPy8amtm8iNbH6Nb3qr3SmykJb4" // dodja .ENV do trzymania secre
});

// INDEX ROUTE - SHOW ALL CAMPGROUNDS
// router.get("/", function(req, res){
//     //Get all campgrounds from db
//     Campground.find({}, function(err, allCampgrounds){
//         if(err){
//             console.log(err);
//         } else {
//             res.render("campgrounds/index", {campgrounds: allCampgrounds});
//         }
//     });
          
// });

router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});


// CREATE ROUTE - ADD NEW CAMPGROUND TO DB

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {    
cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the campground object under image property
  req.body.campground.image = result.secure_url;
  // add author to campground
  req.body.campground.author = {
    id: req.user._id,
    username: req.user.username
  }
  Campground.create(req.body.campground, function(err, campground) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/cats/' + campground.id);
  });
});
});


//NEW ROUTE - SHOWS FORM TO CREATE NEW CAMP
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});



// SHOW - shows more info about one campgroun
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if (err){
           console.log(err);
       } else {
           console.log(foundCampground);
             //render show template with that campground
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
  
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });        
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/cats");
       } else {
           //redirect somewhere(show page)
           res.redirect("/cats/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/cats");
        } else {
            res.redirect("/cats");
        }
    });
});




module.exports = router;