var mongoose    = require("mongoose"),
    Beach       = require("./models/beaches"),
    Comment     = require("./models/comments");


function deleteDB() {
    Beach.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("beach(es) removed")
            Comment.remove({}, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("comment(s) removed")
                }
            })
        }
    })
}

module.exports = deleteDB;