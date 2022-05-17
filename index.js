const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId  = require('mongodb').ObjectId
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tnz6e.mongodb.net/organicdb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri)
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())



//connection establish to mongodb

async function run() {
    try {
      await client.connect();
      const database = client.db("carMechanic");
      const servicesCollection = database.collection("services");
      const productsCollection = database.collection("products");
      console.log('db connected')


      app.get('/services', async (req, res) => {
        const services = await servicesCollection.find({}).toArray()
        res.send(services)
      })
       
     
      app.post('/services', async (req, res) => {
              // create a document to insert
        const service = req.body      
        const reBody = {
           name: service.name,
           price: service.price,
           description: service.description,
           img: service.img
        }
        const result = await servicesCollection.insertOne(reBody);
        if(result.insertedId) {
            res.json(result)
        }
        
      })

             //Get all product API
             app.get('/products', async (req, res) => {
              const query = {}
              const cursor = productsCollection.find(query)
              const result = await cursor.toArray()
              res.send(result)
          })
  
          //Get single product by id API
          app.get('/products/:id', async (req, res) => {
              const id = req.params.id
              const query = { _id: ObjectId(id) }
              const result = await productsCollection.findOne(query)
              res.json(result)
          })
  
          // Add product API
          app.post('/products', async (req, res) => {
              const reqBody = req.body
              // create a document to insert
              const product = {
                  name: reqBody.name,
                  price: reqBody.price,
                  quantity: reqBody.quantity,
                  description: reqBody.description
              }
              const result = await productsCollection.insertOne(product);
              res.json(result)
          })
  
          //Delete product by id API
          app.delete('/products/:id', async (req, res) => {
              const id = req.params.id
              const query = { _id: ObjectId(id) }
              const result = await productsCollection.deleteOne(query)
              res.json(result)
          })
  
            //Update product API
            app.patch('/products/:id', async (req, res) => {
              const reqBody = req.body
              const id = req.params.id
              const query = { _id: ObjectId(id) }
              // if i use put const options = { upsert: true };//// this option instructs the method to create a document if no documents match the filter
              // update a document 
              const product = {
                  $set:{
                      name: reqBody.name,
                      price: reqBody.price,
                      quantity: reqBody.quantity,
                      description: reqBody.description
                  }
              }
  
              const result = await productsCollection.updateOne(query,product);
              if(result.modifiedCount) {
                  res.json(result)
              }
              else {
                  res.json({
                      message:'Failed to update'
                  })
              }
       
          })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);





   app.get('/', (req, res) => {
        res.send('CRUD SERVER IS RUNNING!')
    })
  
  app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`)
  })