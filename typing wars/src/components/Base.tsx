
import React, { useState, useEffect, useRef } from "react";
import { generate } from "random-words"; 
import { Link } from "react-router-dom";
import useSocket from "../hooks/useSocket";


export default function TypingTest({time,updatedata,players,text ,roomtextind}) {
 // console.log(text);
  const [socket,userId]=useSocket();
  let currIndex;
  let score;
 let err;
 let roomindex;
  players.forEach((player)=>{
    if(player.id===userId)
    {
      currIndex=player.currentIndex;
      score=player.score;
    err=player.error;
    roomindex=player.roomtextindex;
    }
    
})
//console.log(roomindex);
//  console.log(players);
   //  console.log(players);
  const [words, setWords] = useState([]);
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(currIndex);
  const [timer, setTimer] = useState(time);
  const [duration, setDuration] = useState(30);
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);
  const [correctcount,setCorrectcount]=useState(players.score);
  const [wrongcount,setWrongcount]=useState(err);
   const [matchEnded,setMatchEnded]=useState(false);
   const [winner,setWinner]=useState("");
   const [start,setStart]=useState(false);
   const hasRun = useRef(false);
   const [roomtextindex,setRoomtextindex]=useState(roomtextind);
  useEffect(()=>{
setCurrentIndex(currIndex);
setCorrectcount(score);
setWrongcount(err);
setRoomtextindex(roomindex);
console.log(roomindex);

  }, [currIndex, score, err, roomindex, players,text]);

   useEffect(() => {
    if (!hasRun.current && text.length > 0) {
      resetTest();
      hasRun.current = true; // Mark as executed
    }
  }, [text]);
  useEffect(() => {
    setTimer(time); // Update local state when prop changes
  }, [time]);

  useEffect(() => {
    if(timer===0)
    {
      setMatchEnded(true);
      let winner;
      let Max=-1;
      console.log(players);
      players.forEach((player)=>{
          if(player.score>Max)
          {
            Max=player.score;
            winner=player.username;

          }
          setWinner(winner);;
      })
      endTest();
    }
  }, [timer]);

  
  const resetTest = () => {
    console.log("resettest",roomtextindex);
    let newWords;
    if(roomtextindex)
    {
     newWords = text.slice(roomtextindex,roomtextindex+25);
    }
  else
  {
  newWords=text.slice(0,25);
  } 
    setWords(newWords);
    setInput("");
    setCurrentIndex(0);
    setTimer(duration);
    setStarted(false);
    setWpm(0);
    setErrors(0);
    setAccuracy(100);
    setCorrectcount(0);
    setWrongcount(0);
    inputRef.current.focus();
  };

  
  const handleInput = (e) => {
    if (!started) setStarted(true); 
    const value = e.target.value;
    setInput(value);

    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      const updatedWords = [...words];
      if (typedWord === words[currentIndex].text) {

        updatedWords[currentIndex].correct = true;
        setCorrectcount((prev)=>prev+1);
      
            //   console.log("it is room text index",roomtextindex);
        updatedata(correctcount+1,currentIndex+1,wrongcount,true,roomtextindex);
        
      } else {
        updatedWords[currentIndex].correct = false;
        setWrongcount((prev)=>prev+1);
        setErrors((prev) => prev + 1);
       
        updatedata(correctcount,currentIndex+1,wrongcount+1,false,roomtextindex);
      }
      setWords(updatedWords);
      setCurrentIndex((prev) => prev + 1);
     // setRoomtextindex((prev)=>prev+1);
      setInput("");
    // console.log(currentIndex);
      if ((currentIndex + 1) % 25 === 0) {
        setWords(text.slice(roomtextindex+25,roomtextindex+49));
           setCurrentIndex(0);
           setRoomtextindex((prev)=>prev+25);
           updatedata(correctcount,0,wrongcount,null,roomtextindex+25);
      }
    }
  };

  // Function to end the test and calculate results
  const endTest = () => {
    //const typedWords = currentIndex;
    const grossWpm = (correctcount/ (duration / 60)).toFixed(2);
    const acc = wrongcount > 0 ? ((correctcount/(correctcount+wrongcount)) * 100).toFixed(2) : 100;
    setWpm(grossWpm);
    setAccuracy(acc);
    setStarted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-[70%] bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Typing Speed Test</h1>
      
      <div className="flex gap-4 mb-4">
      
        <Link className="px-4 py-2  rounded bg-blue-400 flex gap-2 " to="/">Sigleplayer </Link>
        {matchEnded?<Link className="px-4 py-2  rounded bg-green-400 flex gap-2 " to="/matchmaking">Play Again </Link>:null}
      </div>
      
      <div className="bg-gray-800 p-6 rounded w-full max-w-5xl text-2xl text-center min-h-[160px] flex flex-wrap gap-2 justify-center">
        {words.map((word, index) => (
          <span
            key={index}
            className={`px-1 ${index === currentIndex ? "underline text-blue-400" : word.correct === true ? "text-green-500" : word.correct === false ? "text-red-500" : "text-gray-400"}`}
          >
            {word.text}
          </span>
        ))}
      </div>
      
      <input
        ref={inputRef}
        value={input}
        onChange={handleInput}
        disabled={!timer}
        className="mt-4 px-3 py-2 w-3/4 max-w-md text-black rounded outline-none"
      />
      
      <p className="mt-4">Time: {timer}s</p>
      
      {matchEnded ? (
        <div className="mt-4 text-center">
          <h1 className="text-bold text-yellow-400 text-lg">The winner of the match is: <h2 className="text-red-500"> {winner}</h2></h1>
          <h2 className="text-green-400">YourPerformance</h2>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Errors: {wrongcount}</p>
          
          
        </div>
      ):null}
    </div>
  );
}
