const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 8888
require('dotenv').config()

const app = express()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ruwh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
 
  const serviceCollection = client.db("photographyService").collection("services");
 


  app.get('/services',(req,res) => {
    serviceCollection.find()
    .toArray((err,documents) => {
      res.send(documents)
    })
  })
  

  app.get('/service/:id',(req,res) => {
    const id = ObjectId(req.params.id)
    serviceCollection.find({_id:id})
    .toArray((err, item) =>{
      res.send(item[0])
    })
  })
  

  app.post('/addService',(req,res)=>{
    const newService = req.body;
    
    serviceCollection.insertOne(newService)
    .then(result => {
      console.log('inserted one', result.insertedCount)
      // res.send(result.insertedCount > 0)
      res.redirect('/')
    })
  })



  app.delete('/deleteService/:id',(req,res) => {
    const id = ObjectId(req.params.id)
    console.log(id)
    serviceCollection.deleteOne({_id:id})
    .then(result => {
         res.send(result.deletedCount > 0)
    })
  })

//Service section ends here....

  const orderCollection = client.db("photographyService").collection("orders");

  app.get('/allBookings',(req,res) => {
    orderCollection.find({buyerEmail: req.query.email})
    .toArray((err,orders) => {
      //  console.log(orders)
       res.send(orders)
    })
  })

  app.get('/singleOrder/:id',(req, res)=>{
    orderCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  app.get('/orders',(req,res) => {
    orderCollection.find()
    .toArray((err,allOrders) => {
      //  console.log(allOrders)
       res.send(allOrders)
    })
  })

  app.post('/addOrder',(req,res)=>{
    const newOrder = req.body;
    
    orderCollection.insertOne(newOrder)
    .then(result => {
      console.log('inserted one', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  }) 

  app.patch('/updateOrder/:id',(req,res)=>{
    console.log(req.params.id)
     
    orderCollection.updateOne({_id:ObjectId(req.params.id)},
     {
         $set:{ status:req.body.status}
     })
     .then(result=>{
         res.send(result.modifiedCount > 0)
        
       
     })
 })

 const reviewCollection = client.db("photographyService").collection("users");

  app.get('/allUsers',(req,res) => {
    reviewCollection.find()
    .toArray((err,reviews) => {
      //  console.log(reviews)
       res.send(reviews)
    })
  })

  app.post('/addUser',(req,res)=>{
    const newReview = req.body;
    
    reviewCollection.insertOne(newReview)
    .then(result => {
      console.log('inserted one', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  const adminCollection = client.db("photographyService").collection("admins");

  app.get('/allAdmin',(req,res) => {
    adminCollection.find({email: req.query.email})
    .toArray((err,admin) => {
      //  console.log(orders)
       res.send(admin)
    })
  })

  app.post('/addAdmin',(req,res)=>{
    const newAdmin = req.body;
    
    adminCollection.insertOne(newAdmin)
    .then(result => {
      console.log('inserted one', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  }) 
   
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)











