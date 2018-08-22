const express = require('express')
const mongo = require('mongodb');

var MongoClient = mongo.MongoClient;
const app = express()
const url = "mongodb://mongodb:27017/mydb";
let db;
let hitsCount = 0;

MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    db = client.db('hits');
    console.log("Database created!");
    db.collection('hitsCount').updateOne(
        { _id: 1 },
        { $setOnInsert: { _id: 1, hits: 0 } },
        { upsert: true },
        (err, result) => {
            if (err) {
                throw err;
            }
            else {
                app.listen(3000, () => console.log('App is listening on port 3000!'))
            }

            process.on('exit', function () {
                db.close();
            });
        });
});

app.get('/', (req, res) => {
    db.collection('hitsCount').findOne({}, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Something went wrong. Please try again")
        } else {
            hitsCount = result.hits + 1;
            db.collection('hitsCount').updateOne(
                { _id: 1 },
                { $set: { _id: 1, hits: hitsCount } },
                {},
                (err, result) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).send("Something went wrong. Please try again")
                    }
                    else {
                        console.log("Hits count: %s", hitsCount);
                        return res.status(200).send('Hi there! This is hit number: ' + hitsCount.toString())
                    }
                });
        }
    });
});


