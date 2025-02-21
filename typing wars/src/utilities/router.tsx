import { createBrowserRouter, redirect } from "react-router-dom";
import TypingTest from "../components/Singleplayer";
import Multiplayer from "../components/Multiplayer";
import Matchmaking from "../components/Matchmaking";
import socket from "./socket";
import axios from "axios";



 export const Router=createBrowserRouter(
    [
       {
        path:'/',
     element:<TypingTest/>,
       },
       {
         path:'/matchmaking',
         element:<Matchmaking/>,
        
       },

       {
         path:'/multiplayer/:roomid',
         element:<Multiplayer/>,
         loader:async({params})=>{
          try{
          const userid=localStorage.getItem("userId");
          console.log("this is userid",userid);
          const data=await axios.get(`https://typing-wars.onrender.com/multiplayer/${params.roomid}/${userid}`)
          //console.log(data.data.players);
          console.log(data);
          if(data)
          {
            return data;
          }
          }
          catch(err)
          {
            console.log(err.message);
          return   redirect('/');
          }
        }
       }
      
    ]
)
