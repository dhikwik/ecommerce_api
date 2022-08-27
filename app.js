let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
// const mongoUrl = "mongodb://localhost:27017"
const mongoUrl="mongodb+srv://mango:mango12345@cluster0.km6ui.mongodb.net/crystalTest?retryWrites=true&w=majority"

 const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser')
const cors = require('cors')
let port = process.env.PORT || 8210;
var db;

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

//get 
app.get('/',(req,res) => {
    res.send("Welcome to express")
})
 //brand
app.get('/brand',(req,res) => {
    db.collection('brand').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})


//product
app.get('/product',(req,res) => {
    db.collection('product').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})
// item wrt product
app.get('/items/:id',(req,res) => {
    let productItem  = Number(req.params.id)
     db.collection('item').find({product_id:productItem}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})
 
//item wrt brands

app.get('/brandItem/:id',(req,res) => {
    let brandsItem  = Number(req.params.id)
     db.collection('item').find({brand_id:brandsItem}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//filters
// filters
app.get('/filter/:id',(req,res) => {

    let prodId = Number(req.params.id)
    let brand =  Number(req.query.brand)
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    let query = {}
    // if(brand&lcost&hcost){
    //     query = {
    //         "product_id":prodId,"brand_id":brand,
    //         $and:[{cost:{$gt:lcost,$lt:hcost}}]
    //     }
    // }
    if(brand){
        query = {"product_id":prodId,"brand_id":brand}
    }
    else if(lcost&hcost){
        query = {$and:[{cost:{$gt:lcost,$lt:hcost}}],"product_id":prodId}
    }
    db.collection('item').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.post('/menu',(req,res) => {
    console.log(req.body)
    db.collection('item').find({item_id:{$in:req.body}}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

MongoClient.connect(mongoUrl, (err,client) => {
    if(err) console.log("Error While Connecting");
    db = client.db('crystalTest');
    app.listen(port,()=>{
        console.log(`listening on port no ${port}`)
    });
})