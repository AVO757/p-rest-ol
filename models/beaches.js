var mongoose = require("mongoose");

//Schema Setup
var beachesSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId: String,
    location: String,
    lat: Number,
    lng: Number,
    description: String,
    // for connecting user with beach
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// Compile Schema into a model and export it
module.exports = mongoose.model("Beach", beachesSchema);