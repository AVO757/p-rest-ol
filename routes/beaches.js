var express     = require("express"),
app          = express.Router(),
Beach           = require("../models/beaches"),
middleware      = require("../middleware");
// Google Maps
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);


// BEACHES

// Show Beaches
app.get("/beaches", function(req, res) {
    // get all beaches from DB
    Beach.find({}, function(err, allBeaches) {
        if(err) {
            console.log(err);
        } else {
            res.render("beaches/beaches",{beaches: allBeaches});
        }
    })
});


// Form page
app.get("/beaches/new", middleware.isLoggedIn, function(req, res) {
    res.render("beaches/new");
});


// Create beach
app.post("/beaches", middleware.isLoggedIn, function(req, res) {
    //get data from the beach form
    var name = req.body.beach.name;
    var image = req.body.beach.image;
    var desc = req.body.beach.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    geocoder.geocode(req.body.beach.location, function(err, data) {
        if (err || !data.length) {
            req.flash("error", "Invalid address");
            return res. redirect("back");
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newBeach = { name: name, image: image, description: desc, location: location, author: author, lat: lat, lng: lng };
        // Create a new beach and save to DB
        Beach.create(newBeach, function (err, newBeach) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("beaches");
            }
        });
    })
});



// Show detailed beach
app.get("/beaches/:id", function(req, res) {
    Beach.findById(req.params.id).populate("comments").exec(function(err, foundBeach) {
        if(err || !foundBeach) {
            req.flash("error", "Beach not found");
            res.redirect("back");
        } else {
            res.render("beaches/show", {beach: foundBeach});
        }
    });
});


// Edit beach (form page)
app.get("/beaches/:id/edit", middleware.checkBeachOwnership, function(req, res) {
        Beach.findById(req.params.id, function(err, foundBeach) {
            res.render("beaches/edit", {beach: foundBeach});
        });
});

// Update beach
app.put("/beaches/:id", middleware.checkBeachOwnership, function(req, res) {
    geocoder.geocode(req.body.beach.location, function(err, data) {
        if (err || !data.length) {
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        req.body.beach.lat = data[0].latitude;
        req.body.beach.lng = data[0].longitude;
        req.body.beach.location = data[0].formattedAddress;

        Beach.findByIdAndUpdate(req.params.id, req.body.beach, function (err, updatedBeach) {
            if (err) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("/beaches/" + req.params.id);
            } else {
                res.redirect("/beaches/" + req.params.id);
            }
        });
    });
});

// Destroy beach
app.delete("/beaches/:id", middleware.checkBeachOwnership, function(req, res) {
    Beach.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
            res.redirect("/beaches");
        } else {
            req.flash("success", "Beach deleted")
            res.redirect("/beaches");
        }
    });
});

module.exports = app;