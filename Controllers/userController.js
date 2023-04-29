const express = require('express');
const { tokenSign } = require('../helpers/generateToken')
const router = express.Router();
const user = require('../Models/userModel');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const CryptoJS = require("crypto-js");


const key = '123456';

 //encriptacion de correo
            

 function encrypt(text, key) {
    const utf8Text = CryptoJS.enc.Utf8.parse(text); // Convierte el texto a UTF-8
    const encrypted = CryptoJS.AES.encrypt(utf8Text, key);
    return encrypted.toString();
  }
  //decript

  function decrypt(ciphertext, key) {
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key);
    const utf8Text = decrypted.toString(CryptoJS.enc.Utf8); // Convierte el texto descifrado a UTF-8
    return utf8Text;
  }

//Post to create a new user
//dentro de este post enviar el correo
router.post('/users', async (req, res) => {
    console.log(req.body);
    const correo = req.body.email;
    const correoCrypto = await encrypt(correo,key);
    console.log(correoCrypto)
    const userI = user.model(req.body);
    userI.save()
        .then((data) => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'superachievercr@gmail.com',
                    pass: 'okpbqtlptghidhpz'
                }
            });

            const mailOptions = {
                from: 'NewsPortal',
                to: correo,
                subject: 'Email confirmation',
                text: `Hello, Thank for registering. Please link the link bellow http:http://localhost:3000/confirmar?data=${correo}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log('Sent email: ' + info.response);
                    resolve();
                }
            });


           
            res.header({ 'location': `http://localhost:50000/api/users/?id=${data._id}` });
            res.status(201).json(data);
        }).catch((err) => res.status(422).json({ message: err.message }));
});

//Get all users 
router.get('/users', (req, res) => {
    user.model.find({}, (error, users) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(users);
    });
});

//Get one user by id
router.get('/users/:id', (req, res) => {
    user.model.findById(req.params.id, (error, users) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!users) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName
        });
    });
});


//update user information
router.put('/users/:id', (req, res) => {
    user.model.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, users) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!users) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({
            _id: users._id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName
        });
    });
});

//delete user
router.delete('/users/:id', (req, res) => {
    user.model.findByIdAndRemove(req.params.id, (error, users) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!users) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted successfully');
    });
});
//este codigo se va ejecutar cuando verifique el correo
router.post('/users/verify', async (req, res) => {
    const email = req.body.email;
    console.log(email)
   // const emailDesencript = await decrypt(email,key);
   
    //console.log(emailDesencript)
  
    user.model.findOne({ email: email })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'Usuario no encontrado' });
            } else {
                user.estado = true;
                user.save()
                    .then((user) => {
                        res.status(200).json({ message: 'Correo electrónico verificado exitosamente' });
                    }).catch((err) => res.status(422).json({ message: err.message }));
            }
        }).catch((err) => res.status(422).json({ message: err.message }));
});



module.exports = router;