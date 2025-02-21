import { useEffect, useState } from "react";
import PlayerProgressGraph from "./ProgressGraph";
import Base from "./Base";
import useSocket from "../hooks/useSocket";
import { useLoaderData, useParams } from "react-router-dom";
export default function Multiplayer() {
  const roomtext=useLoaderData();
    // console.log(roomtext);
  const [players, setPlayers] = useState([]);
  const [socket, userid] = useSocket();
  const [countdown, setCountdown] = useState(30);
  const [playerInfo, setPlayerInfo] = useState([]);
  const [text,setText]=useState(roomtext.data.text);
  const roomId = useParams();
  const roomtextind=roomtext.data.roomtextindex;
 console.log("roomtextind",roomtext.data);
 const name=localStorage.getItem("name");
 
  const updatedata = (correctword,currentIndex,err,iscorrect,roomtextindex) => {
    console.log(roomtextindex);
    const data = {
      roomId: roomId.roomid,
      userId:userid,
      name:name,
      score:correctword,
      currentIndex:currentIndex,
      error:err,
      iscorrect:iscorrect,
      roomtextindex:roomtextindex,
    };
    console.log(data.roomtextindex);
    socket.emit("update_data", data);
  };

  useEffect(() => {
    console.log("run");
    const Update = (roomdata) => {
      
      setPlayers(roomdata.playerInfo);
      setCountdown(roomdata.time);
      console.log(roomdata.text[0]);
     // setText(roomdata.text);
    };
    socket.on("room_data", Update);

    return () => {
      socket.off("room_data", Update);
    };
  }, []);

  return (
    <div className="flex flex-row items-center p-4 w-full  bg-gray-900">
      <Base time={countdown} updatedata={updatedata} players={players}  text={text} roomtextind={roomtextind} />
      <PlayerProgressGraph players={players} />
    </div>
  );
}
