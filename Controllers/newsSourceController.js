const express = require('express');
const router = express.Router();
const newsSource = require('../Models/newsSourceModel');
const userModel = require('../Models/userModel');
const categoryM = require('../Models/categoryModel.js');
const news = require('../Models/newsModel');
const Parser = require('rss-parser');
const parser = new Parser();

//Post to create a newsSource
router.post('/newsSource', (req, res) => {

    const source = new newsSource.model(req.body);
    source.save((error) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(201).json({
            _id: source._id,
            rssUrl: source.rssUrl,
            name: source.name,
            category: source.category,
            idUser: source.userId
        });
    });
});



//Get all newsSource 
router.get('/newsSource', (req, res) => {
    newsSource.model.find({}, (error, source) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(source);
    });
});

//Get one newsSource by id
router.get('/newsSource/:id', (req, res) => {
    newsSource.model.findById(req.params.id, (error, source) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!source) {
            return res.status(404).send('newsSource not found');
        }
        res.status(200).json({
            _id: source._id,
            rssUrl: source.rssUrl,
            name: source.name,
            category: source.category,
            idUser: source.userId
        });
    });
});


//update newsSource information
router.patch('/newsSource/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rssUrl, name, userId, categoryId } = req.body;
        console.log(id);
        let Id_user = await userModel.model.findById(req.body.userId);
        let categoryId_filt = await categoryM.model.findById(req.body.categoryId);
        console.log(Id_user);
        if (Id_user && categoryId_filt) {//valida si existe el usuario y categoria
            //let savedNew = await Newcon.updateOne({ _id:id},{$set:Newcon});//guarda datos
            const savedNewSource = await newsSource.model.findByIdAndUpdate(id, { rssUrl, name, userId, categoryId }, { new: true });
            res.json(savedNewSource);
            res.status(200);
        } else {
            res.status(422);
            throw new Error('No se encontró el recurso');
        }
    } catch (error) {//se cae si no se encuentra 
        res.status(422);
        res.json({ message: error.message + "Faltan elementos en la solicitud" });
    }
});

//delete newsSource
router.delete('/newsSource/:id', (req, res) => {
    newsSource.model.findByIdAndRemove(req.params.id, (error, source) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!source) {
            return res.status(404).send('newsSource not found');
        }
        res.status(200).send('newsSource deleted successfully');
    });
});

router.post('/newsSource/:id/process', async (req, res) => {
    try {
        const { id } = req.params;
        const newssorce = await newsSource.model.findById(id);//busca el id del recurso
        //await news.model.deleteMany({ new_source_id: newssorce._id });//borra todas las noticas de este recurso
        const feed = await parser.parseURL(newssorce.rssUrl);//procesa el feed
        console.log(feed);
        const createdNews = [];//guarda el objeto guardado en mongodb
        for (const item of feed.items) {//lee el feed
            const nuevaNoticia = new news.model({//objeto New
                title: item.title,
                description: item.contentSnippet,
                permalink: item.link,
                date: item.pubDate,
                src: item.enclosure,
                newsSourceId: newssorce._id,
                userId: newssorce.userId,
                categoryId: newssorce.category,
            });
            const savedNew = await nuevaNoticia.save();//guarda la noticas
            createdNews.push(savedNew);//guarda el resultado en la lista
            res.setHeader('Location', `http://localhost:4000/api/newsSource/?id=${savedNew._id}`); // Agregar la ubicación por id en el header
        }

        res.status(201).json(createdNews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;