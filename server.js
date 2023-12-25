const express = require('express')
const app = express();

// create server
const http = require('http').createServer(app)
const port = process.env.PORT || 3000;
http.listen(port,()=>{
    console.log(`Listening on port : ${port}`)
})
app.use(express.static(__dirname +'/public'))
app.get('/',(req,res)=>{
    // res.send('Hello World...')
    res.sendFile(__dirname + '/index.html')
})


//socket 
const io=require('socket.io')(http);
var users={};

io.on('connection',(socket)=>{
    console.log('Connected....')

    socket.on("new-user-joined",(uname)=>{
        // console.log("joined")
        users[socket.id]=uname;
        socket.broadcast.emit('user-connected',uname);
        // to target all the socket we use io.emit()
        io.emit("user-list",users);
    })

    socket.on("disconnect",()=>{
        // console.log("deleted")
        socket.broadcast.emit('user-disconnected',userdisc=users[socket.id]);
        delete users[socket.id]; 
        io.emit("user-list",users);
    })
    socket.on('message',(msg)=>{
        // console.log(msg)----{ user: 'fatima', message: 'hello' }
        socket.broadcast.emit('message',msg)

    })

})
