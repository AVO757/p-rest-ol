require ("dotenv").config()

var express =       require("express"),
app         =       express(),
bodyParser  =       require("body-parser"),
flash       =       require("connect-flash")
methodOverride  =   require("method-override"),
mongoose    =       require("mongoose"),
passport    =       require("passport"),
LocalStrategy =       require("passport-local"),
User        =       require("./models/user"),
deleteData =        require("./deleteData");


// delete beaches and comments data
// deleteData();

// APP CONFIG
/////////////////////////////////////////////////
app.set("view engine", "ejs");
// For CSS
app.use(express.static(__dirname + "/public"));
// Connect mongoose database
mongoose.connect("mongodb://localhost/project_rest");
// Set body-parser
app.use(bodyParser.urlencoded({extended: true}));
// Method-Override
app.use(methodOverride("_method"));
// flash messages
app.use(flash());

// PASSPORT CONFIGURATION
/////////////////////////////////////////////////
app.use(require("express-session")({
    secret: "passport",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE
// Add currentUser (whether the user has logged in) to all routres and templates
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    // flash message
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
});

/////////////////////////////////////////////////


var beachRoutes     = require("./routes/beaches");
var commentRoutes   = require("./routes/comments");
var indexRoutes     = require("./routes/index");

app.use(beachRoutes);
app.use(commentRoutes);
app.use(indexRoutes);



/////////////////////////////////////////////////
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server started");
});