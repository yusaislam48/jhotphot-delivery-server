const express = require('express')
const cors = require('cors');
require('dotenv').config()
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb').ObjectID;

const app = express()
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2tldj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const servicesCollection = client.db("JhotPhot-Delivery").collection("services");

  // add service
  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new newService', newService)

    servicesCollection.insertOne(newService)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  }); 

  //find services
  app.get('/services', (req, res) => {
    servicesCollection.find()
    .toArray((error, documents) => {
      res.send(documents);
    })
  });

  app.get('/services/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log(id)
    servicesCollection.find({_id: id})
    .toArray((error, documents) => {
      res.send(documents);
    })
  });

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})