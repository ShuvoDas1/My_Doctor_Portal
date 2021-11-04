const express = require('express');
const cors = require('cors');
const  MongoClient  = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectID = require('mongodb').ObjectId;

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const port = 4000



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vktpy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const appointmentCollection = client.db("newDoctorsPortal").collection("appointments");
  
  app.post('/addAppointment',(req,res)=>{
    const appointment = req.body;
    //console.log(appointment)
    appointmentCollection.insertOne(appointment)
    .then(result=>{
      res.send(result)
    })
  })

  app.post('/appointmentsByDate', (req, res)=>{
    const date= req.body;
    appointmentCollection.find({date: date.date})
    .toArray((err,documents)=>{
        res.send(documents)
    })
  })

  app.patch('/appointments/update/:id',(req,res)=>{
    appointmentCollection.updateOne({_id:ObjectID(req.params.id)},
    {
      $set: {isVisited: req.body.isVisited}
    })
  })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)