const express = require('express');
const router = express.Router();
const users = require("../Models/userModel");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

router.post('/passwor', async (req, res) => {
    try {
      const useremail = req.body.email;
      console.log(useremail);
      const data = await users.model.findOne({ email: useremail }); //valida el correo electronico del usuario
      if (!data || data.estado === false) {//valida si  trae contenido 
        return res.status(200).json({ message: "Datos Incorrectos" })
      }
      const codes = Math.floor(1000 + Math.random() * 9000);//genera el codigo
      data.codigo=codes;
      await data.save();
      console.log(data.data);
      console.log(useremail);
      sendEmailLogin(data.codigo, data.firstname,data.email)
      return res.status(200).json({ message: 'Favor verifique su sesion' });
    } catch (error) {//se cae si no se encuentra 
      res.status(422);
      res.json({ message: error.message + " Datos Incorrectos" });
    }
  });
  function sendEmailLogin(data, nombre,correo) {
    try {
      return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'superachievercr@gmail.com', // Dirección de correo desde la cual se enviará el mensaje
            pass: 'okpbqtlptghidhpz' // Contraseña de la dirección de correo
          }
        });
  
        const mailOptions = {
          from: 'Admin',
          to: correo,
          subject: 'Logeo Passwordless',
          text: `Dear ${nombre}, click the link to access to your account :http://localhost:3000/passwordless?data=${data}`
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log('Correo enviado: ' + info.response);
            resolve();
          }
        });
      });
    } catch {
      console.log("error");
    }
  }

  router.post('/passwordless', async (req, res) => {
    try {
      const userdata = req.body.data;
      console.log(userdata);
      const data = await users.model.findOne({ codigo: userdata }); //valida el correo electronico del usuario
      if (!data) {//valida si  trae contedio 
        return res.status(200).json({ message: "Datos Incorrectos" })
      }    
      console.log(data.password);
      console.log(userdata);
      
      const userId = {
        id: data._id,
        role: data.role 
      }
      const token = jwt.sign(userId, "123456");//genera el token
      return res.status(201).json({ message: 'Acceso', token, userId });
  
    } catch (error) {//se cae si no se encuentra 
      res.status(422);
      res.json({ message: error.message + " Datos Incorrectosx" });
    }
  });


module.exports = router;