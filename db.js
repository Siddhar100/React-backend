const mongoose = require('mongoose');
const dotenv = require("dotenv");
require('dotenv').config()
const mongoURI = "mongodb://localhost:27017/inotebook"

const connectToMongo = async ()=>{
    try {
     //   mongoose.set('strictQuery', false)
       const url = process.env.MONGODB_URI;
        mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Mongo is connected')
    }
    catch(error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectToMongo;