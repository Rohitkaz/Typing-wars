import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import { ToastContainer, toast } from 'react-toastify';
 // Update with your backend URL

export default function Matchmaking() {
  const [name, setName] = useState("");
  const [findingMatch, setFindingMatch] = useState(false);
  const navigate = useNavigate();
  const [socket,userid]=useSocket();
 console.log(userid);
   useEffect(() => {
    const matchFoundFn = (roomId) => {
     
      navigate(`/multiplayer/${roomId}`);
    }
    socket.on("match_found", matchFoundFn);

    return () => {
      socket.off("match_found", matchFoundFn);
    };
  }, [navigate, socket]);
  const notify = () => toast('🦄 Could not find match', {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    //transition: Bounce,
    })

  useEffect(() => {
    const matchmakingtimeout = () => {
      console.log("could not find match");
     // alert("match not found");
     
     notify();
      setFindingMatch(false);
    }
    socket.on("matchmaking_timeout", matchmakingtimeout);

    return () => {
      socket.off("matchmaking_timeout",matchmakingtimeout);
    };
  });
  const findMatch = () => {
    
    setFindingMatch(true);
    socket.emit("find_match", { name });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <ToastContainer />
      {findingMatch ? (
        <>
        <button className="px-4 py-2 rounded bg-gray-700 flex items-center gap-2" disabled>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Finding Match...
        </button>
        
          </>
      ) : (
        <button className="px-4 py-2  rounded bg-gray-700" onClick={findMatch}>
          Find Match
        </button>
      )}
    </div>
  );
}
