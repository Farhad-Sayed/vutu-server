const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express()

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxn7b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const enrollCollection = client.db("vutuDB").collection("enroll");
  const servicesCollection = client.db("vutuDB").collection("services");
  const adminCollection = client.db("vutuDB").collection("admin");
  const reviewsCollection = client.db("vutuDB").collection("reviews");
  // perform actions on the collection object
  // service section
  app.post('/addservices', (req, res) =>{
    const newService = req.body;
    // console.log('add new service: ', newService);
    servicesCollection.insertOne(newService)
    .then(result =>{
      res.send(result.insertedCount>0);
    })
  })

    // create api for loading services from database
    app.get('/services', (req, res) =>{
      servicesCollection.find()
      .toArray((err, documents) =>{
        res.send(documents);
      })
    })

    // review section
    app.post('/addreviews', (req, res) =>{
      const newReview = req.body;
      // console.log('add new review: ', newReview);
      reviewsCollection.insertOne(newReview)
      .then(result =>{
        res.send(result.insertedCount>0);
      })
    })

    // create api for loading reviews from database
    app.get('/reviews', (req, res) =>{
      reviewsCollection.find()
      .toArray((err, documents) =>{
        res.send(documents);
      })
    })

   // track object id
    app.get('/service/:id', (req, res) =>{
      const id = ObjectId(req.params.id);
      servicesCollection.find({_id: id})
        .toArray((err, documents) =>{
        res.send(documents);
      // console.log(documents);
    })
  })

      // delete item
  app.delete('/deleteService/:id', (req, res) =>{
    const id = ObjectId(req.params.id);
    console.log('delete: ', id);
    servicesCollection.deleteOne({_id: id})
    .then(result =>{
      // console.log(result, id);
      res.send(result.deletedCount>0);
    })
  })

  // enroll data
  app.post('/enroll', (req, res) =>{
    const enroll = req.body;
    enrollCollection.insertOne(enroll)
    .then(result =>{
      res.send(result.insertedCount>0);
    })
  })


  app.get('/orderlist', (req, res) =>{
    const email = req.query.email;
    console.log(email);
    adminCollection.find({email: email})
    .toArray((err, adminEmail) =>{
      const filter ={}
      if(adminEmail.length===0){
        filter.email=email;
      }
      enrollCollection.find(filter)
      .toArray((err, document) =>{
        res.send(document)
      })
    })
  })

  // add admin
  app.post('/addAdmin', (req, res) =>{
    const admin = req.body;
    // console.log('add new service: ', newService);
    adminCollection.insertOne(admin)
    .then(result =>{
      res.send(result.insertedCount>0);
    })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
})

  // client.close();
});


app.get('/', (req, res) => {
    res.send("hello!")
})


app.listen(process.env.PORT || port)