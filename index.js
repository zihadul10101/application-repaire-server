const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vki6z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

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


  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new service: ', newService);
    serviceCollection.insertOne(newService)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send({count:result.insertedCount > 0})
        })
})

app.post('/addReview', (req, res) => {
  const newReview = req.body;
  console.log('adding new service: ', newReview);
  reviewCollection.insertOne(newReview)
      .then(result => {
          console.log('inserted count', result.insertedCount);
          res.send({count:result.insertedCount > 0})
      })
})



  console.log('database connected successfully');




});



app.listen(process.env.PORT || port)