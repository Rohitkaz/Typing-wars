
import React, { useState, useEffect, useRef } from "react";
import { generate } from "random-words"; // Importing generate function from random-words library
import { Link } from "react-router-dom";
// Available durations for the typing test
const durations = [30, 60, 120, 180];

export default function TypingTest() {
  // State variables to manage words, input, index, timer, and results
  const [words, setWords] = useState([]);
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [duration, setDuration] = useState(30);
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);
  const [correctcount,setCorrectcount]=useState(0);
  const [wrongcount,setWrongcount]=useState(0);
  
  useEffect(() => {
    resetTest();
  }, [duration]);

  
  useEffect(() => {
    let interval;
    if (started && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && started) {
      endTest(); 
    }
    return () => clearInterval(interval);
  }, [timer, started]);

  
  const resetTest = () => {
    const newWords = generate(25).map(word => ({ text: word, correct: null })); 
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
      } else {
        updatedWords[currentIndex].correct = false;
        setWrongcount((prev)=>prev+1);
        setErrors((prev) => prev + 1);
      }
      setWords(updatedWords);
      setCurrentIndex((prev) => prev + 1);
      setInput("");

      if ((currentIndex + 1) % 25 === 0) {
        setWords(generate(25).map(word => ({ text: word, correct: null })));
        setCurrentIndex(0);
      }
    }
  };

  
  const endTest = () => {
    
    const grossWpm = (correctcount/ (duration / 60)).toFixed(2);
    const acc = wrongcount > 0 ? ((correctcount/(correctcount+wrongcount)) * 100).toFixed(2) : 100;
    setWpm(grossWpm);
    setAccuracy(acc);
    setStarted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Typing Speed Test</h1>
      
      <div className="flex gap-4 mb-4">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={`px-4 py-2 rounded ${duration === d ? "bg-blue-500" : "bg-gray-700"}`}
          >
            {d}s
          </button>
        ))}
        <Link className="px-4 py-2  rounded bg-red-600 flex gap-2 " to="/matchmaking">Type War <img src="/sword.png"></img></Link>
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
      
      {!started && timer === 0 && (
        <div className="mt-4 text-center">
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Errors: {errors}</p>
          
          <button
            onClick={resetTest}
            className="mt-2 px-4 py-2 bg-blue-500 rounded"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
