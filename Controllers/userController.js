const express = require('express');
const { tokenSign } = require('../helpers/generateToken')
const { encrypt } = require('../helpers/passwordBcrypt')
const router = express.Router();
const user = require('../Models/userModel');


//Post to create a new user
router.post('/users', (req, res) => {
    console.log(req.body);
    const userI = user.model(req.body);
    userI.save()
      .then((data) => {
        res.header({ 'location': `http://localhost:50000/api/users/?id=${data._id}`});
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
    user.model.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, users) => {
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


module.exports = router;