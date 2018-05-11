var Beach = require("../models/beaches"),
Comment = require("../models/comments");


var middlewareObj = {};

// MIDDLEWARE FOR BEACHES
// Whether the user has the permission to access
middlewareObj.checkBeachOwnership = function(req, res, next) {
    // is logged in?
    if(req.isAuthenticated()) {
        Beach.findById(req.params.id, function(err, foundBeach) {
            if(err || !foundBeach) {
                req.flash("error", "Beach not found")
                res.redirect("/beaches");
            } else {
                // does the user own the post?
                if(foundBeach.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not own this beach post")
                    res.redirect("/beaches");
                }
            }
        });
    } else {
        req.flash("error", "Please login first")
        res.redirect("back");
    }
};


// MIDDLEWARE FOR COMMENTS
// Whether the user has the permission to access
middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is logged in?
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment) {
                req.flash("error", "Comment not found")
                res.redirect("/beaches/" + req.params.id);
            } else {
                // does the user own the post?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not own the comment post")
                    res.redirect("/beaches/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "Please login first")
        res.redirect("back");
    }
};


// Middleware for Login
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    //flash message (add it before you redirect)
    req.flash("error", "Please Login First")
    res.redirect("/login");
};

module.exports = middlewareObj;