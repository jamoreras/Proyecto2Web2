const express = require('express');
const { tokenSign } = require('../helpers/generateToken')
const { compare } = require('../helpers/passwordBcrypt')
const router = express.Router();
const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

const accountSid = '';
const authToken = '';
const client = new twilio(accountSid, authToken);

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
    
        if (password === data.password && data.estado == true) {
            const userId = {
                id: data._id,
                name: data.firstname,
                role: data.role
            };
            const token = jwt.sign(userId, "123456");
               
            //enviar SMS con twilio
            const codes = Math.floor(1000 + Math.random() * 9000);//genera el codigo
            console.log(codes);
            try {
                const message = await client.messages.create({
                    body: `Your verification code is ${codes}`,
                    from: '+16206478671',
                    to: '+506 ' + data.phoneNumber
                });
                console.log('Message sent:', message.sid);
                data.codigo = codes;
                await data.save();
            } catch (error) {
                console.error(error);
            }

            return res.status(200).json({ token, userId });
        } else {
            return res.status(200).json({ message: "Datos Incorrectos" })
        }



    } catch (error) {//se cae si no se encuentra 
        res.status(422);
        res.json({ message: error.message + " Datos Incorrectos" });
    }
});
//verificar el codigo de twilio
router.post('/login/Verify', async (req, res) => {
    try {
        const usercodigo = req.body.codigo;
        const useremail = req.body.email;  
        console.log("--------");
        console.log(usercodigo);
        console.log(useremail);          
               
        const data = await userModel.model.findOne({ email: useremail });
        if (!data) {//valida si  trae contedio 
            return res.status(200).json({ message: "Datos Incorrectos" })
        }
        console.log(data.codigo);
        if (usercodigo === data.codigo) {          
            return res.status(201).json({ message: 'Codigo Correcto'});
        } else {
            return res.status(200).json({ message: "Datos Incorrectos" })
        }
    } catch (error) {//
        res.status(422);
        res.json({ message: error.message + " Datos Incorrectos" });
    }

})




module.exports = router;