import React from 'react'
import { useAuthContex } from '../contex/userContex';
import { UserIcon } from './userIcon';

const Navbar = () => {
  const [auth, setAuth, loading] = useAuthContex();
  return (
    <div className="navbar bg-base-300 h-16 md:h-20 border-border border-b-2">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">VideoChat</a>
      </div>
      <div className="flex-none">
        <UserIcon />
      </div>
    </div>
  )
}

export default Navbar
