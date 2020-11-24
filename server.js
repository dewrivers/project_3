const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const socketio = require('socket.io');
const http = require('http');



const PORT = process.env.PORT || 7777;


// set up express
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const router = require('./routes/Router');

app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(router);

// setting up socket.io connection
io.on('connection', (socket) =>{
    console.log('We have new connection');
    
    socket.on('join', ({ name, room }, callback) =>{
        console.log(name, room);
        
        if(error){
            callback({error: error});
        }
        
    })
    // stting up socket.io disconnection 
    socket.on('disconnect', () =>{
        console.log('User have left!!');
    })

});

// set up mongoose connection
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



server.listen(PORT,() => console.log(`server running on port ${PORT}`));