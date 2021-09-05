const express = require('express')
const ObjectId = require("mongodb").ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vki6z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 7000;



app.get('/', (req, res) => {
  res.send('Hello World!')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err);
  const serviceCollection = client.db("serviceRepire").collection("service");
  const reviewCollection = client.db("serviceRepire").collection("reviews");
  const orderCollection = client.db("serviceRepire").collection("orders");
  const adminCollection = client.db("serviceRepire").collection("admin");
  // perform actions on the collection object



  app.get('/service', (req, res) => {
    serviceCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })



  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  app.get('/orders', (req, res) => {
    orderCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    console.log(email);
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        });
});

  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    console.log('adding new event:', newAdmin)
    adminCollection.insertOne(newAdmin)
        .then(result => {
            console.log('inserted count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
  })


  app.post('/addOrder', (req, res) => {
    const newOrdering = req.body;
    console.log(newOrdering);
    orderCollection.insertOne(newOrdering)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0);
      })
    console.log(newOrdering);
  })



  app.delete("/deleteProduct/:id", (req, res) => {
    servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
            console.log(result);
            res.send(result.deletedCount > 0);
        })
})

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new service: ', newService);
    serviceCollection.insertOne(newService)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send({ count: result.insertedCount > 0 })
      })
  })

  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log('adding new service: ', newReview);
    reviewCollection.insertOne(newReview)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send({ count: result.insertedCount > 0 })
      })
  })



  console.log('database connected successfully');




});



app.listen(process.env.PORT || port)