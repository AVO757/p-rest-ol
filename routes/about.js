var express = require("express"),
    app = express.Router();

// Profile about me/portfolio
app.get("/about/me", function (req, res) {
    res.render("about/me");
});

app.get("/about/portfolio", function (req, res) {
    res.render("about/portfolio");
});

module.exports = app;