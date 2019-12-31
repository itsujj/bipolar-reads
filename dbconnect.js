const mongoose = require("mongoose");

connection = mongoose.connect("mongodb://ujjwal:hello_people1988@ds253398.mlab.com:53398/bddatabase", { useNewUrlParser: true, useUnifiedTopology: true  }, (err) => {
    if (err) {
        throw err;
    }
    console.log("Connected to Database");
});

module.exports = connection;