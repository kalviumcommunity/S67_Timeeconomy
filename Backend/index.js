const express = require('express');
const connectDB = require('./db');
const router = require('./controll');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
const port = process.env.PORT || 8080;
const url = process.env.db_url;
console.log(url);

app.use(cookieParser());


app.use("/main", router);


app.listen(port, async() => {

  try{
    await connectDB(url);
    console.log(`Server is running on port ${port}`);
  }
  catch(error){
    console.error(error);
  }
});

