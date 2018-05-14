var express = require("express"),
    app = express.Router();

// Profile about me
app.get("/about/me", function (req, res) {
    res.render("about/me");
});

app.get("/about/website", function (req, res) {
    res.render("about/website");
});

module.exports = app;