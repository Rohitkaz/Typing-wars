import { io } from "socket.io-client";
import {singleton}  from "./singleton";

 const socket= singleton("socket",()=>io("https://typing-wars.onrender.com",{autoConnect:false,
   auth:{
      id:"",
      name:""
   }
   }),)
export default socket;