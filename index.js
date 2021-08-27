const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3300
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send(`<h4>Welcome to My Mongo API</h4>`)
})

// Config MongoDB
let { MongoClient, ObjectID } = require('mongodb')
let urlConnection = `mongodb+srv://gugi01:bassplayer@mongogugi.ayane.mongodb.net/toko?retryWrites=true&w=majority`

let mongo = new MongoClient(urlConnection, { useNewUrlParser: true, useUnifiedTopology: true })

mongo.connect((err, results) => {
    if (err) {
        console.log(err)
    }
    console.log("Connected to MongoDB Server")
})

app.post('/add-data', (req, res) => {
    mongo.connect((err, connectdb) => {
        if (err) {
            console.log(err)
            res.status(500).send(err)
        }
        const db = connectdb.db('toko')
        db.collection('product').insertMany([req.body], (errInsert, results) => {
            if (errInsert) {
                console.log(errInsert)
                res.status(500).send(errInsert)
            }
            console.log("Insert Success", results)
            res.status(200).send(results)
        })
    })
})

app.get('/get-data', (req, res) => {
    mongo.connect((err, connectdb) => {
        connectdb.db('toko').collection('product').find({}).toArray((errGet, results) => {
            if (errGet) {
                console.log(errGet)
                res.status(500).send(errGet)
            }
            res.status(200).send(results)
        })
    })
})

app.patch('/update', (req, res) => {
    mongo.connect((err, connectdb) => {
        connectdb.db('toko').collection('product').updateOne({ nama: "Jaket" }, { $set: { harga: 250000 } }, (errUpdate, results) => {
            if (errUpdate) {
                console.log(errUpdate)
                res.status(500).send(errUpdate)
            }
            res.status(200).send(results)
        })
    })
})

app.listen(PORT, () => console.log(`API Mongo is Running : ${PORT}`))