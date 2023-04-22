const express = require('express');
const userRouter = require('./Router/userRouter');
const urlRouter = require('./Router/urlRouter');
const PORT = process.env.PORT || 5000;
const server = express();
const mongoose = require('mongoose');
const auth = require('./Middleware/authMiddleware');
require('dotenv').config();



mongoose.connect(`${process.env.DB_MONGOURL}`)
  .then(() => console.log('Connected! to Db'));


server.use(express.json());
server.use(express.urlencoded());
server.use('/users',userRouter);
server.use('/urls',auth,urlRouter);

server.get('/',(req,res)=>{
  res.send('<h1>This is backend >> NODE.JS, EXPRESS, JWT ,REDIS-CACHE, MONGO-DB ,SHORTID, BCRYPT</h1>')
})


// Start server
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});