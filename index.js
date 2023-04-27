const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./Controllers/userController');
const newsSourceRoutes = require('./Controllers/newsSourceController');
const newsRoutes = require('./Controllers/newsController');
const categoryRoutes = require('./Controllers/categoryController');
const loginRoutes = require('./Controllers/loginController');
const jwt = require('jsonwebtoken');

const { dbConnect } = require('./configMongo');

const bodyParse = require("body-parser");

const app = express();
dbConnect();

const port = 5000;


app.use(cors());
app.use(bodyParse.json());

app.use('/api', loginRoutes);
app.use('/api', userRoutes);

app.use(function (req, res, next) { //valida token
    const autenticador = req.headers['authorization'];//obtinen el token
    const token = autenticador && autenticador.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No se proporciono el token.' });
    }
  
    jwt.verify(token, "123456", (err, user) => {//verifica y decodifica el token
      if (err) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
        console.log(req.tokeng);
      next();
    });
  });

app.use('/api', newsSourceRoutes);
app.use('/api', newsRoutes);
app.use('/api', categoryRoutes);




app.listen(port, () => console.log("News Cover app listening on port " + port +"!!" ))