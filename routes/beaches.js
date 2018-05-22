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

///////////////////////////
// image upload
///////////////////////////

var multer = require('multer');
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
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
var upload = multer({ storage: storage, fileFilter: imageFilter })

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: "avocloud",
    api_key: 311266135518586,
    api_secret: process.env.CLOUDINARY_API_KEY
});

///////////////////////////

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
app.post("/beaches", middleware.isLoggedIn, upload.single("beach[image]"), function(req, res) {
    //get data from the beach form
    var name = req.body.beach.name;
    var desc = req.body.beach.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    // google map location
    geocoder.geocode(req.body.beach.location, function(err, data) {
        if (err || !data.length) {
            req.flash("error", "Invalid address");
            return res. redirect("back");
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;

        // image upload
        cloudinary.uploader.upload(req.file.path, function (result) {
            // add cloudinary url for the image to the beach object under image property
            req.body.beach.image = result.secure_url;
            var image = req.body.beach.image;
            // add image's public_id to campground object
            req.body.beach.imageId = result.public_id;
            var imageId = req.body.beach.imageId;
            var newBeach = { name: name, image: image, imageId: imageId,  description: desc, location: location, author: author, lat: lat, lng: lng };            
            
            // Create a new beach and save to DB
            Beach.create(newBeach, function (err, newBeach) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("beaches");
                }
            });
        });
    });
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
app.put("/beaches/:id", middleware.checkBeachOwnership, upload.single("beach[image]"), function(req, res) {
    //google map
    geocoder.geocode(req.body.beach.location, function(err, data) {
        if (err || !data.length) {
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        req.body.beach.lat = data[0].latitude;
        req.body.beach.lng = data[0].longitude;
        req.body.beach.location = data[0].formattedAddress;

        // beach update and image update
        Beach.findById(req.params.id, async function (err, beach) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if (req.file) {
                    try {
                        await cloudinary.uploader.destroy(beach.imageId);
                        var result = await cloudinary.uploader.upload(req.file.path);
                        beach.imageId = result.public_id;
                        beach.image = result.secure_url;
                    } catch (err) {
                        req.flash("error", err.message);
                        return res.redirect("back")
                    }
                }
            beach.lat = req.body.beach.lat;
            beach.lng = req.body.beach.lng;
            beach.location = req.body.beach.location;
            beach.name = req.body.beach.name;
            beach.description = req.body.beach.description;
            beach.save();
            req.flash("success", "Successfully Updated!");
            res.redirect("/beaches/" + req.params.id);
            }
        });
    });
});

// Destroy beach
app.delete("/beaches/:id", middleware.checkBeachOwnership, function(req, res) {
    Beach.findById(req.params.id, async function (err, beach) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        try {
            await cloudinary.uploader.destroy(beach.imageId);
            beach.remove();
            req.flash('success', 'Beach deleted successfully!');
            res.redirect('/beaches');
        } catch (err) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
        }
    });
});

module.exports = app;