var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description: "blag blag blah"
    },
    {
        name: "Desert Mesa",
        image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg",
        description: "blag blag blah"
    },
    {
        name: "Canyon floor",
        image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg",
        description: "blag blag blah"
    }
    ]

function seedDB(){
    //remove all campgrounds
    Campground.remove({}, function(err){
        if (err){
            console.log(err);
        } else {
            console.log("removed campgrounds!");
                // add a few campgrounds
            data.forEach(function(seed){
              Campground.create(seed, function(err, campground){
                  if(err){
                      console.log(err);
                  } else {
                      console.log("added a campground");
                      //create a comment
                      Comment.create(
                          {
                                text: "This place is great.",
                                author: "Homer"
                      }, function(err, comment){
                          if(err){
                              console.log(err);
                          } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                          }
                      });
                  }
              });
            });
        }
    });

    // add a few comments
}


module.exports = seedDB;
