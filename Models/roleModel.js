const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 const roleSchema = new Schema({
  name: {type: String,}
 },{
    versionKey: false,
 });
 module.exports = {
   "model" : mongoose.model('role', roleSchema),
   "schema" : roleSchema
 };