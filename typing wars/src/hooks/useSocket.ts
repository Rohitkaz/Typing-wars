import { useEffect, useState } from "react"
import socket from "../utilities/socket"
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

const useSocket = () => {
    const [sc, setSocket] = useState(socket)
    const [userId, setUserId] = useState("")
    const [name, setName] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        if(socket.connected) return;

        let localName = localStorage.getItem("name")

        let id = localStorage.getItem("userId")
        if (id && localName) {
            setUserId(id)
            setName(localName)
        }else {
            const newId = uuidv4()
            localStorage.setItem("userId", newId)
            
            const userName = prompt("Please enter your name", "Anonymous")
            if(!userName) {
                throw new Error("No name entered")
            }
            
            setUserId(newId)
            setName(userName)
            
            id = newId;
            localName = userName
            localStorage.setItem("name", localName)
        }
        socket.auth.id = id
        socket.auth.name = localName

        socket.connect()
        
        const onError = (err: any) => {
            console.log(err)
            navigate("/")
        }
        
        socket.on("connect_error", onError)

        return ()=>{
            socket.off("connect_error", onError)
            socket.disconnect()
        }
    }, [])


    return [sc, userId] as const;
}
export default useSocket