const express = require('express');
const router = express.Router();
const category = require('../Models/categoryModel');


//Post to create a category
router.post('/category', (req, res) => {

    const nCategory = new category.model(req.body);
    nCategory.save((error) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(201).json(nCategory);
    });
});



//Get all category 
router.get('/category', (req, res) => {
    category.model.find({}, (error, nCategory) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(nCategory);
    });
});

//Get one category by id
router.get('/category/:id', (req, res) => {
    category.model.findById(req.params.id, (error, nCategory) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!nCategory) {
            return res.status(404).send('category not found');
        }
        res.status(200).json(nCategory);
    });
});


//update category information
router.put('/category/:id', (req, res) => {
    category.model.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, nCategory) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!nCategory) {
            return res.status(404).send('category not found');
        }
        res.status(200).json(nCategory);
    });
});

//delete category
router.delete('/category/:id', (req, res) => {
    category.model.findByIdAndRemove(req.params.id, (error, nCategory) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!nCategory) {
            return res.status(404).send('category not found');
        }
        res.status(200).send('category deleted successfully');
    });
});


module.exports = router;