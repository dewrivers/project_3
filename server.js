const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const PORT = process.env.PORT || 7777;


// set up express
const app = express();
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));


// set up mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, 
(err) => {
    if (err) throw err;
    console.log( 'Mongoose connection stablished');
});

// set up routes
app.use('/users', require('./routes/userRoouter'));


app.listen(PORT,() => console.log(`server running on port ${PORT}`));