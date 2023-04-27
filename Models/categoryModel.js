const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Categories = new Schema({
  name: { type: String, required: true },
});
const UserModel = mongoose.model('categories', Categories);
module.exports = {
  schema: Categories,
  model: UserModel
}
