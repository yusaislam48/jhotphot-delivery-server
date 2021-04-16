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
const { ObjectId } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2tldj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const servicesCollection = client.db("JhotPhot-Delivery").collection("services");
  const bookingsCollection = client.db("JhotPhot-Delivery").collection("bookings");
  const reviewsCollection = client.db("JhotPhot-Delivery").collection("reviews");

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

  // add booking Service
  app.post('/bookingService', (req, res) => {
    const bookService = req.body;
    console.log('booking a new Service', bookService)

    bookingsCollection.insertOne(bookService)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  }); 

  // add review
  app.post('/addReview', (req, res) => {
    const review = req.body;
    console.log('adding new newService', review)

    reviewsCollection.insertOne(review)
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

   //find review
   app.get('/review', (req, res) => {
    reviewsCollection.find()
    .toArray((error, documents) => {
      res.send(documents);
    })
  });

  //find all booked services
  app.get('/bookedServices', (req, res) => {
    bookingsCollection.find()
    .toArray((error, documents) => {
      res.send(documents);
    })
  });
  
  //find booked services by email address
  app.get('/bookedServices/:email', (req, res) => {
    bookingsCollection.find({email: req.params.email})
    .toArray((error, documents) => {
      res.send(documents);
    })
  });


  //update service status
  app.patch('/updateService', (req, res) => {
    const updateServiceData = req.body;
    console.log('updating Service', updateServiceData)

    bookingsCollection.updateOne(
      { _id: ObjectId(req.body._id) },
      { $set: {status: req.body.updateStatus}
      })
    .then(result => {
      res.send(result);
    })
  }); 

  //delete service data
  app.delete('/deleteService/:id', (req, res) => {
    servicesCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
    .then(documents => res.send( documents))
  })

  //delete bookings data
  app.delete('/deleteBookings/:id', (req, res) => {
    bookingsCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
    .then(documents => res.send( documents))
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})