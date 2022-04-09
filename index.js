const express = require('express');
const { Server } = require("socket.io");
const http = require('http');
const mysql = require('mysql');
const parser = require("body-parser");
const path = require('path');
const mainApi = require("./mainApi");
const Middleware = require("./Function/middleware/middleware");


const utility = require("./Function/utility/utility");
const { eseguiQuery } = require('./Function/utility/utility');




const app = express();
const server = http.createServer(app);
const io = new Server(server);


const portApi = 3000
const soketPort = 3030

let members = 0;
var address = undefined


let connection = mysql.createConnection({ // connesione a mysql
  host: '45.14.185.102',
  user: 'smash_info',
  password: 'Smash_Admin_Setting2022!',
  database: 'smash_info'
})


app.use(express.static(path.join(__dirname, 'public')));



io.on('connection', (socket) => {
  socket.on('player', (player) => {  
    members += player;
    console.log('Online members: '+ members)
    io.emit('player', members) 
  });
  socket.on('disconnect', () => {
    members--;
    if(members < 0){
      members = 0;
    }
    io.emit('player', members )
    console.log('Online members: '+ members)
  });
});

Middleware(app , connection)
mainApi(app , connection)



server.listen(soketPort, () => {
  console.log('listening on *: '+soketPort);
});
