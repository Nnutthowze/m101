const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true })); 

const errorHandler = (err, req, res) => {
    res.status(500).send(err);
}

MongoClient.connect('mongodb://localhost:27017/video', (err, db) => {
    if (err) throw err;
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views/movie.html'));
    });
    
    app.post('/movie', (req, res, next) => {
        const { title, year, imdb } = req.body;
                
        if (!title.length || !year.length || !imdb.length) {
            return next('Please provide an entry for all fields.');
        }
        
        db.collection('movies').insertOne({ title, year, imdb }, (err, item) => {
            if (err) return next(err);
            res.send("Document inserted with _id: " + item.insertedId);
        });
    });
    
    app.use(errorHandler);
    
    app.listen(3000);
});
