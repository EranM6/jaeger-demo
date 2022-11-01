const mongoose = require("mongoose");
const userSchema = require("./userSchema");

const Users = mongoose.model("user", userSchema, "users");

const getUser = (id, callback) => Users.findOne().byId(id).exec(callback);

module.exports = { getUser };