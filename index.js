const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middlewareeeee

app.use(cors());
app.use(express.json());

//console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dwgzdef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const serviceCollection = client.db('carDoctor').collection('services');
    const bookingCollection = client.db('carDoctor').collection('bookings');
    const appointmentCollection = client.db('carDoctor').collection('appointment');



    //appointment related api

    app.get('/appointment',async(req,res)=>{
      const curser = appointmentCollection.find();
      const result = await curser.toArray();
      res.send(result);

    })

    app.get('/appointments/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await appointmentCollection.findOne(query);
      res.send(result);
    })

    app.put('/appointments/:id',async(req,res)=>{
      const id = req.params.id;
      const updateAppointment = req.body;
      console.log(id , updateAppointment);
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedAppointment = {
        $set:{
          name: updateAppointment.name,
          email: updateAppointment.email,
          date: updateAppointment.date,
          phone: updateAppointment.phone,
          service: updateAppointment.service,
          phone: updateAppointment.phone,
        }
      }
      const result = await appointmentCollection.updateOne(filter,updatedAppointment, options)
      res.send(result)
      
    })

    app.delete('/appointment/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await appointmentCollection.deleteOne(query);
      res.send(result);
    })



    app.post('/appointment',async(req,res)=>{
      const user = req.body;
      console.log('new appointment user',user);
      const result = await appointmentCollection.insertOne(user);
      res.send(result);
    });
    

     
    //services related api
    app.get('/services',async(req,res)=>{
      const curser = serviceCollection.find();
      const result = await curser.toArray();
      res.send(result);

    })

    app.get('/services/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}

      const options = {
       
        projection: { price:1, title: 1, service_id: 1, img: 1 },
        
      };

      const result = await serviceCollection.findOne(query,options);
      res.send(result);
    })

    
    //bookings
    app.get('/bookings',async(req,res)=>{
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email:req.query.email}
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })


    app.post('/bookings', async(req,res)=>{
      const booking = req.body;
      console.log(booking);

       const result = await bookingCollection.insertOne(booking);
       res.send(result);
    });

    app.patch('/bookings/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateBookings = req.body;
      console.log(updateBookings);
      const updateDoc = {
        $set:{
          status:updateBookings.status
        },
      };
      const result = await bookingCollection.updateOne(filter,updateDoc)
      res.send(result);
    })

    app.delete('/bookings/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Car is running')
})

app.listen(port,()=>{
    console.log(`car server is running ${port}`);
})