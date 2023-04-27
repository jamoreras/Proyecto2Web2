const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 const newsSourceSchema = new Schema({
  rssUrl: {type: String},
  name: {type: String},
  category: {type: String},
  userId:{type: String},

 });
 module.exports = {
   "model" : mongoose.model('newsSource', newsSourceSchema),
   "schema" : newsSourceSchema
 };