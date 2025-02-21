import express from "express" 
import http from "http"
import {Server} from "socket.io"
import  cors from "cors"
import { addUser,removeuser } from "./Utils/joinedusers.js"
import { v4 as uuidv4 } from 'uuid';
import { AddUser, updateRoomdata } from "./Utils/gamestate.js"
import router from "./routes/multiplayerinitialization.js"
import dotenv from "dotenv";
dotenv.config();
const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//app.use("/register",emailAuth)
const server=http.createServer(app);
export const io=new Server(server,{
    cors:{
origin:process.env.FRONTEND_URL,
credentials: true,
    }
}

)


io.use((socket, next) => {
    const {id, name} = socket.handshake.auth
    if (id && name) {
        socket.data.userId = id
        socket.data.name = name
        console.log(id,name);
        next()
    }else {
        next(new Error('Authentication error'))
        
    }
  });

io.on("connection",(socket)=>{
    
    socket.join(socket.data.userId)
    
  socket.on("find_match", () => {
    
      
    const roomId = AddUser(socket.data.userId,socket.data.name);
      
    socket.join(roomId);
      
    

  });
  socket.on("update_data",(data)=>{
      updateRoomdata(data);
  })
  socket.on("disconnect",()=>{
    removeuser(socket.userId);
    console.log(`disconnected${socket.id}`);
   })
})



app.use(cors(
    {
        origin:process.env.FRONTEND_URL,
        credentials: true,
    }
))

app.use('/multiplayer',router);

console.log("hi");
  
   
server.listen(8000,()=>{

    console.log("server connected at port 8000");
})


