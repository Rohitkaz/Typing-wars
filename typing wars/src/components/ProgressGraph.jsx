import React from "react";
import useSocket from "../hooks/useSocket";
export default function PlayerProgressGraph({ players }) {
    const [_,id]=useSocket();
    return (
        <div className="w-[40%] p-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 text-white">SPEEDOMETER</h2>
            <div className="w-full max-w-md bg-gray-100 p-4 rounded-lg shadow-md flex gap-4 justify-center">
                {players.map((player, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <span className={`text-sm font-semibold mb-1 ${player.id===id?"text-yellow-500":""}`}>{player.id===id?"you":player.username}</span>
                        <div className="w-6 h-32 bg-gray-300 rounded-full relative flex items-end overflow-hidden">
                            <div
                                className="bg-blue-500 w-6 rounded-full transition-all duration-300"
                                style={{ height: `${player.score}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-semibold mt-1">{player.score}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
