const mongoose = require('mongoose')

const dbConnect = () => {
    const DB_URI ="mongodb://localhost:27017/baseDatos2"
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, res) => {
        if (!err) {
            console.log('**** CONEXION CORRECTA ****')
        } else {
            console.log('***** ERROR DE CONEXION ****')
        }
    })
}

module.exports = { dbConnect }