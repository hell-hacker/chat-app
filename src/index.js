const express=require('express');
const http=require('http');
const path=require('path');
const socketio=require('socket.io');
const Filter=require('bad-words');

const app=express();
const port=process.env.PORT||4000;
const server=http.createServer(app);
const io=socketio(server);
const {addUser,removeUser,getUser,getUserByRoom,user}=require('../public/js/users.js');
const publicDirectoryPath=path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));
let Message='Welcome';
let count=0;
io.on('connection',(socket)=>{
    console.log("User is Connected");
     socket.on('join',(username,room)=>{
          let User= addUser({id:socket.id,username,room});
            socket.join(room);
         socket.broadcast.to(room).emit('sendMessage',`${username} has joined`,username)   //to render message to everyone when new room is created        
         socket.emit('sendMessage','welcome','You');
        })
     
     socket.on('requestMessage',(message,callback)=>{

         const filter=new Filter();
         User=getUser(socket.id);
         if(filter.isProfane(message)){
             return callback('Profane message is not allowed');
         }
          socket.broadcast.to(User.room).emit('sendMessage',message,User.username)
          socket.emit('sendMessage',message,'You');    //to emit the to everyone
          
          callback('Delivered');   //to signify the blue tick
      })
      
      socket.on('requestLocation',(message,callback)=>{
        User=getUser(socket.id);
         socket.broadcast.to(User.room).emit('sendLocation',message,User.username)
         socket.emit('sendLocation',message,'You');    //to emit the to everyone
         
         callback('Location Delivered');   //to signify the blue tick
     })
     
     socket.on('userslist',(callback)=>{
        User=getUser(socket.id);
        var list=getUserByRoom(User.room);
         callback(list);
     })
      socket.on('disconnect',()=>{
           User=getUser(socket.id);
          io.to(User.room).emit('sendMessage',`${User.username}  has left`);
          User= removeUser(socket.id);
          console.log('User is desconnected');
      })
       
})

server.listen(port,()=>{
    console.log(`servers is on ${port}`);
})