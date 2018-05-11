var express     = require("express"),
app             = express.Router(),
Beach           = require("../models/beaches"),
Comment         = require("../models/comments"),
middleware      = require("../middleware");

/////////////////////////////////////////////////
// COMMENTS
/////////////////////////////////////////////////

// Comment Forum
app.get("/beaches/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Beach.findById(req.params.id, function(err, foundBeach) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {beach: foundBeach});
        }
    });
});

// Create comment
app.post("/beaches/:id/comments", middleware.isLoggedIn, function(req, res) {
    Beach.findById(req.params.id, function(err, beach) {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    beach.comments.push(comment);
                    beach.save();
                    req.flash("success", "Successfully added comment")
                    res.redirect("/beaches/" + beach._id);
                }
            });
        }
    });
});

// Edit comment
app.get("/beaches/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", { beach_id: req.params.id, comment: foundComment });
        }
    });
});

// Update comment
app.put("/beaches/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect( "/beaches/" + req.params.id);
        }
    });
});

// Delete comment
app.delete("/beaches/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("error", "Comment deleted")
            res.redirect("/beaches/" + req.params.beach_id);
        }
    });
});


module.exports = app;