var express     = require("express"),
app          = express.Router(),
Beach           = require("../models/beaches"),
middleware      = require("../middleware");


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
    var location = req.body.beach.location;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBeach = {name: name, image: image, description: desc, location: location, author: author};
    Beach.create(newBeach, function(err, newBeach) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("beaches");
        }
    });
});



// Show detailed beach
app.get("/beaches/:id", function(req, res) {
    Beach.findById(req.params.id).populate("comments").exec(function(err, foundBeach) {
        if(err) {
            console.log(err);
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
    Beach.findByIdAndUpdate(req.params.id, req.body.beach, function(err, updatedBeach) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/beaches/" + req.params.id);
        }
    });
});

// Destroy beach
app.delete("/beaches/:id", middleware.checkBeachOwnership, function(req, res) {
    Beach.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/beaches");
        }
    });
});

module.exports = app;