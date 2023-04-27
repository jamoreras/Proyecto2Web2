const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenSign = async (user) =>{
    return jwt.sign(
        {
            _id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h",
        }
    );
}

module.exports = { tokenSign }