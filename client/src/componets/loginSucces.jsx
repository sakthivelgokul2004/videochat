import React from 'react'

import { useNavigate } from "react-router-dom";
import { useUserContex } from '../contex/userContex';
 export default function LoginSuccess  ()  {
  const [user,setUser] = useUserContex()
//  localStorage.setItem('auth', "name");
  const navigate = useNavigate();
  const res = fetch("/api/auth/getUserDetail", {
    method: 'GET',
  }).then((res) => res.json()).then((res) => setUser((prvies)=>({ displayName: res.userName, email: res.email, photoURL: res.photoUrl}) ))
  return (
    <>
    <div>LoginSuccess</div>
    <button onClick={()=>navigate("/")}>continue</button>
     </>
  )
}

