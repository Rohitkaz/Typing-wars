import { singleton } from "./singleton.js";
const gameState = singleton("gamestate", () => new Map());
import { v4 as uuidv4 } from "uuid";
import { io } from "../index.js";
import { generate } from "random-words";
const MATCHMAKING_TIME = 8 * 1000;

export function InitializeRoom() {
  const roomId = uuidv4();
  const room = {
    id: roomId,
    status: "matchmaking",
    players: new Map(),
    time: 30,

  };

  gameState.set(roomId, room);

  setTimeout(() => {
    startMatch(roomId);
  }, MATCHMAKING_TIME);
  return room;
}
export function AddUser(userId, username) {
  const player = {
    id: userId,
    username: username,
    score: 0,
    currentIndex:0,
    error:0,
    roomtextindex:0,
  };
  let joinedRoom = null;

  if (gameState.size === 0) {
    // when no room is there
    const room = InitializeRoom();
    //console.log("no room");
    room.players.set(userId, player);
    joinedRoom = room.id;
  } else {
    for (const [roomId, room] of gameState) {
      // joined someoneelse' room
      if (room.players.size < 5) {
        //console.log("someoneelse room");
        room.players.set(userId, player);
        joinedRoom = room.id;
        break;
      }
    }
    if (joinedRoom === null) {
      // all room full so new room created for the user
      const room = InitializeRoom();
      //console.log("another room");
      room.players.set(userId, player);
      joinedRoom = room.id;
    }
  }

  return joinedRoom;
}

export function startMatch(roomId) {
  const room = gameState.get(roomId);

  if (room.players.size < 2) {
    console.log("timeout");
    io.to(roomId).emit("matchmaking_timeout");
    // remove all sockets from this roomId
    const socketsInRoom = io.sockets.adapter.rooms.get(roomId);

    if (socketsInRoom) {
      socketsInRoom.forEach((socketId) => {
        io.sockets.sockets.get(socketId)?.leave(roomId);
      });
    }
    gameState.delete(roomId);
  } else {
    console.log("match found");
    room.status = "playing";
    // generating sample words for the room
    //.map(word => ({ text: word, correct: null }));

    room.text = generate(200).map(word => ({ text: word, correct: null }))
   // console.log(room.text);

    room.interval = setInterval(() => {
      room.time--;
      if (room.players.size === 0) clearInterval(room.interval);
      else {
        const roomdata = {
          playerInfo: [],
          time: room.time,
        };

        for (const [userId, player] of room.players) {
          roomdata.playerInfo.push(player);
        }

        roomdata.playerInfo.forEach((player) => {
          
          io.to(player.id).emit("room_data", roomdata);
        });
        if (room.time === 0) {
          clearInterval(room.interval);
           // remove all sockets from this roomId
    const socketsInRoom = io.sockets.adapter.rooms.get(roomId);

    if (socketsInRoom) {
      socketsInRoom.forEach((socketId) => {
        io.sockets.sockets.get(socketId)?.leave(roomId);
      });
    }
    gameState.delete(roomId);
        }
      }
    }, 1000);
    io.to(roomId).emit("match_found", roomId);
  }
}

export function updateRoomdata(data) {
  //console.log("updating data", data.score);
  const roomId = data.roomId;
  console.log(roomId,data.iscorrect,data.roomtextindex);
  const room=gameState.get(roomId);
  const roomtext = gameState.get(roomId).text;
  //console.log(roomtext);
  const index=data.roomtextindex+data.currentIndex-1;
  console.log("index to be changed",index);
   if(data.iscorrect===true)
  {
   roomtext[index].correct=true;
  }
  if(data.iscorrect===false)
  {
    console.log("word is typed wrong");
    room.text[index].correct=false;
  }
  //console.log(room);
  const player = {
    id: data.userId,
    username: data.name,
    score: data.score,
    currentIndex:data.currentIndex,
    error:data.error,
    roomtextindex:data.roomtextindex,
  };
  room.players.set(data.userId, player);
}
/*const data = {
  roomId: roomId,
  userId:userid,
  name:name,
  score:correctword,
};*/
export function getRoomdata(roomId) {
  const roomdata = gameState.get(roomId);
  return roomdata;
}
