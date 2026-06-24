import React from 'react'
import { useAuthContex, useUserContex } from '../contex/userContex';

import CustomSigninGoogle from "../componets/customSigninGoogle.jsx"
export const UserIcon = () => {
  const [auth, setAuth, loading] = useAuthContex();
  const [user, setUser] = useUserContex()
  async function signOut(){
        const res = await fetch("/api/auth/signout", {
          method: 'POST',
        })
    if(res.ok){
      setAuth(false);
      setUser(null);
    }
  }
  return (
    <>
      {auth &&
        <div className="flex-none dropdown dropdown-end">
          <button tabIndex={0} role="button" className="btn btn-square btn-ghost">
            <div className="avatar">
              <div className="rounded-full">
                <img src={user.photoURL} />
              </div>
            </div>
          </button>
          <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow rounded-box w-52 mt-4 bg-base-100">
            <li><button onClick={signOut}>Sign Out</button></li>
          </ul>
        </div>
      }
      {!auth && <CustomSigninGoogle />}
    </>
  )
}

