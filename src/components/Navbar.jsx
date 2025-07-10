import React from 'react'
import { FaBell, FaUserCircle } from 'react-icons/fa'

const Navbar = ({ expanded }) => {
  return (
    <nav className={`fixed top-0 z-40 bg-primary-800 px-4 py-3 flex justify-between h-16 transition-all duration-300 ${expanded ? "left-64" : "left-20"} right-0`}>
      <div className="flex items-center text-xl">
        <span className="text-white font-semibold">Disaster Recovery</span>
      </div>

      <div className="flex items-center gap-x-5">
        
        <div className='text-white'><FaBell className='w-6 h-6'></FaBell></div>
        <div className='relative'>
            <button className='text-white'>
                <FaUserCircle className='w-6 h-6 mt-1' />
                <div className='z-10 hidden absolute rounded-lg shadow w-32'>
                    <ul>
                        <li><a href="">Profile</a></li>
                        <li><a href="">Settings</a></li>
                        <li><a href="">Log Out</a></li>
                    </ul>
                </div>
            </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar