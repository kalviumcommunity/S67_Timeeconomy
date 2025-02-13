const express = require('express');
const app = express();
const env = require('dotenv').config();
const connectDB = require('./db.js');
const mongoose  = require("mongoose")
const dataRoutes =  require("./controll.js");
const router = require('./controll.js');

const port = process.env.PORT || 5000;
const url = process.env.db_url;

app.get('/ping', (req, res) => {
    res.send('Pong');
    }
);
app.use("/main",router);

app.listen(port, async() => {
  try{
    await connectDB(url);
    console.log(`Server is running on port ${port}`);
  }
  catch(error){
    console.error(error);
  }
});

