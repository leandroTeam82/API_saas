const express=require("express")
const router=require("./router")
const bodyparser = require("body-parser")
const cors = require('cors');

const app=express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });
  
app.use(bodyparser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyparser.json({ limit: '50mb' }));
app.use(router)
app.use(cors());


// Serve static files from the "images" directory
app.use('/images', express.static('images'));

module.exports=app