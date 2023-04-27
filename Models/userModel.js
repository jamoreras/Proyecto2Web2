const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  email: { type: String, required: true, unique: true },
  firstname: { type: String,},
  lastname: { type: String,},
  password: { type: String,},
  address: { type: String },
  phoneNumber: { type: Number },
  role: { type: String, required: true }
});
const UserModel = mongoose.model('users', User);
module.exports = {
  schema: User,
  model: UserModel
}