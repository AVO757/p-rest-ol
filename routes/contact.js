var express = require("express"),
    app = express.Router();


app.get("/contact", function (req, res) {
    res.render("contact");
});

module.exports = app;