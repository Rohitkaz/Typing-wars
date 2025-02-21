import { io } from "socket.io-client";
import {singleton}  from "./singleton";

 const socket= singleton("socket",()=>io("http://localhost:8000",{autoConnect:false,
   auth:{
      id:"",
      name:""
   }
   }),)
export default socket;