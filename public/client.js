const socket=io()
let uname;
let textarea =document.querySelector('.textarea');
let messageArea=document.querySelector('.message_area')
let users_list=document.querySelector('.users-list');
let users_count=document.querySelector('.users-count');

var audio=new Audio('/tring.mp3');

do{
     uname = prompt("Please enter your name!....")
}while(!uname);

// connection code
socket.emit("new-user-joined",uname);

socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'Joined')
})

function userJoinLeft(name,status){
    let div=document.createElement('div')
    div.classList.add('user-join');
    let content=`
    <p><b>${name}</b> : ${status} the chat</p>
    `;
    div.innerHTML=content;
    messageArea.appendChild(div)
}

//disconnection user code
socket.on('user-disconnected',(userdisc)=>{
    userJoinLeft(userdisc,'Left')
})


//update the user-list
socket.on("user-list",(users)=>{
    users_list.innerHTML="";
    users_arr = Object.values(users);
    for(i=0;i<users_arr.length;i++)
    {
        let p=document.createElement('p')
        p.innerText=users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML=users_arr.length;

})

//code to Append the msg and name on send button icon
function fun(){
    sendMessage(textarea.value);
    audio.play();
}
function sendMessage(umsg){
    let msg={
        user:uname,
        message:umsg.trim(),
    }
    //append
    appendMessage(msg,'outgoing')
    textarea.value='';
    scrollToBottom()

    //send to server
    socket.emit('message',msg);
}
function appendMessage(msg, type){
   let mainDiv = document.createElement('div')
   let className = type;
   mainDiv.classList.add(className,'message');
   let markup =`
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
   `
   mainDiv.innerHTML=markup;
   messageArea.appendChild(mainDiv)
}

//receive message
socket.on('message',(msg)=>{
    //  console.log(msg)----{ user: 'fatima', message: 'hello' }
    // socket.broadcast.emit('message',msg)
    appendMessage(msg,'incoming')
    scrollToBottom()
})


// to scroll up when new msg come
function scrollToBottom(){
    messageArea.scrollTop=messageArea.scrollHeight;
}
