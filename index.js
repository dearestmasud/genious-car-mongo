const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT|| 4000;
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oan01.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function main(){
    try{
        await client.connect();
        const database = client.db('masudDB');
        const serviceCollection = database.collection('services');
        
        //GET API
        app.get('/services',async(req,res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //POST API
        app.post('/services',async(req,res)=>{
            const service = req.body; 
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //DELETE API
        app.delete('/services/:id',async(req,res)=>{
            const id =req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.deleteOne( query);
            res.json(result);
        })
    }
    finally{

    }
}
main().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('geni server home page');
});
app.listen(port,()=>{
    console.log('server running on ',port);
});