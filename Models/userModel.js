const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  email: { type: String, required: true, unique: true },
  firstname: { type: String,},
  lastname: { type: String,},
  password: { type: String,},
  address: { type: String },
  phoneNumber: { type: Number },
  estado:{type:Boolean, required:true},
  codigo:{type: Number, required:true},
  role: { type: String, required: true }
});
const UserModel = mongoose.model('users', User);
module.exports = {
  schema: User,
  model: UserModel
}