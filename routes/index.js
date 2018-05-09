var express     = require("express"),
app             = express.Router(),
User            = require("../models/user"),
passport        = require("passport");



// Homepage
app.get("/", function(req, res) {
    res.render("home");
});

/////////////////////////////////////////////////
// AUTH ROUTES
/////////////////////////////////////////////////

// show sign up form
app.get("/register", function(req, res) {
    res.render("auth/register");
});

// handel sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/beaches");
        });
    });
});

// show login form
app.get("/login", function(req, res) {
    res.render("auth/login");
});

// handle login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/beaches", 
        failureRedirect: "/login"
    }), function(req, res) {
    
});

// logic route
app.get("/logout", function(req,res) {
    req.logout();
    res.redirect("/beaches");
});



module.exports = app;