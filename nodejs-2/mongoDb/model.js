const mongoose = require("mongoose");
const userSchema = require("./userSchema");

const Users = mongoose.model("user", userSchema, "users");

const getUser = (id, callback) => Users.findOne().byId(id).exec(callback);

const getRandom = callback => Users.aggregate([{$sample: {size: 1}}], (err, docs) => {
    callback(err, docs[0])
})

module.exports = { getUser, getRandom };