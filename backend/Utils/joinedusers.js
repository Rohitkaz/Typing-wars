import { singleton } from "./singleton.js";
const Allusers = singleton("USers", () => new Map());
 
export function addUser(userid,username)
{
    
console.log("user added");

    Allusers.set(userid,username);
    
}
export function getUser(userid)
{
 return Allusers.get(userid);
}
export function removeuser(userId)
{
    console.log("user deleted");
    Allusers.delete(userId);
}