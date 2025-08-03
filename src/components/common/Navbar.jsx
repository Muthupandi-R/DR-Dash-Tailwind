import React from 'react'
import { FaBell, FaUserCircle } from 'react-icons/fa'

const Navbar = ({ expanded }) => {
  return (
    <nav className={`fixed top-0 z-40 bg-gradient-to-l from-primary-900 via-primary-800 to-primary-700 px-4 py-3 flex justify-between h-12 transition-all duration-300 ${expanded ? "left-64" : "left-20"} right-0`}>
      <div className="flex items-center text-xl">
        {!expanded && (
          <span className="font-extrabold text-lg tracking-wide font-['Poppins',_sans-serif] bg-gradient-to-r from-primary-200 via-primary-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-md">
            Disaster Recovery
          </span>
        )}
      </div>

      <div className="flex items-center gap-x-5">
        
        <div className='text-primary-100'><FaBell className='w-6 h-6'></FaBell></div>
        <div className='relative'>
            <button className='text-primary-100'>
                <FaUserCircle className='w-6 h-6 mt-1' />
                <div className='z-10 hidden absolute rounded-lg shadow w-32 bg-primary-900 text-primary-100'>
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