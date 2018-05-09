var Beach = require("../models/beaches"),
Comment = require("../models/comments");


var middlewareObj = {};

// MIDDLEWARE FOR BEACHES
// Whether the user has the permission to access
middlewareObj.checkBeachOwnership = function(req, res, next) {
    // is logged in?
    if(req.isAuthenticated()) {
        Beach.findById(req.params.id, function(err, foundBeach) {
            if(err) {
                res.redirect("back");
            } else {
                // does the user own the post?
                if(foundBeach.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};


// MIDDLEWARE FOR COMMENTS
// Whether the user has the permission to access
middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is logged in?
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                // does the user own the post?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};


// Middleware for Login
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;