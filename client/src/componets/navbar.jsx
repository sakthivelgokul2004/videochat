import React from 'react'

const Navbar = () => {
  return (
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">VideoChat</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-primary px-8 mx-4 text-base ">
            Login
          </button>
        </div>
      </div>
  )
}

export default Navbar
