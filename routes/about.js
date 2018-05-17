var express = require("express"),
    app = express.Router();


app.get("/about/Project-REST", function (req, res) {
    res.render("about/p-rest");
});

module.exports = app;