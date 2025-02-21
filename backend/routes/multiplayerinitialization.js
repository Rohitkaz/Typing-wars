import express from "express"
import { getRoomdata } from "../Utils/gamestate.js";
const router=express.Router()
router.get("/:roomid/:userid",async(req,res)=>{
   const roomId=req.params.roomid;
   const userid=req.params.userid;
   console.log("this is userid ",userid);
   console.log(roomId);
   try{
    const roomdata=getRoomdata(roomId);
    const roomtext={text:roomdata.text,roomtextindex:roomdata.players.get(userid).roomtextindex};
    console.log(roomtext);
    if(roomtext)
    {
        return res.status(200).send(roomtext);
    }
   }
    catch(err)
    {
       console.log(err.message);
       return res.status(400).send("something went wrong");
    }
    
})
export default router;