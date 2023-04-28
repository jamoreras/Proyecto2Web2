const express = require('express');
const { tokenSign } = require('../helpers/generateToken')
const { compare } = require('../helpers/passwordBcrypt')
const router = express.Router();
const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const data = await userModel.model.findOne({ email: email });
        if (!data) {
            return res.status(200).json({ message: "Datos Incorrectos" })
        }
        console.log(data.password);
        console.log(password);

        if (password === data.password) {
            const userId = {
                id: data._id,
                name:data.firstname,
                role: data.role 
            };
            const token = jwt.sign(userId, "123456");
            return res.status(200).json({ token, userId });
        } else {
            return res.status(200).json({ message: "Datos Incorrectos" })
        }



    } catch (error) {//se cae si no se encuentra 
        res.status(422);
        res.json({ message: error.message + " Datos Incorrectos" });
    }
});


module.exports = router;