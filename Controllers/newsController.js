const express = require('express');
const router = express.Router();
const news = require('../Models/newsModel');


//Post to create a news
router.post('/news', (req, res) => {

    const nNews = new news.model(req.body);
    nNews.save((error) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(201).json(nNews);
    });
});



//Get all news 
router.get('/news', (req, res) => {
    news.model.find({}, (error, nNews) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(nNews);
    });
});

//Get one news by id
router.get('/news/:id', (req, res) => {
    news.model.findById(req.params.id, (error, nNews) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!nNews) {
            return res.status(404).send('news not found');
        }
        res.status(200).json(nNews);
    });
});


//update newsSource information
router.put('/news/:id', (req, res) => {
    news.model.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, nNews) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!nNews) {
            return res.status(404).send('news not found');
        }
        res.status(200).json(nNews);
    });
});

//delete news
router.delete('/news/:id', (req, res) => {
    news.model.findByIdAndRemove(req.params.id, (error, nNews) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!nNews) {
            return res.status(404).send('news not found');
        }
        res.status(200).send('news deleted successfully');
    });
});


module.exports = router;