import React, { useState } from "react";  
import { FaBell, FaUserCircle } from "react-icons/fa";  
import { useMsal } from "@azure/msal-react";   
import { useNavigate } from "react-router-dom";   

const Navbar = ({ expanded }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  // 🔹 Handle Azure logout only
  const handleLogout = async () => {
    const cloud = localStorage.getItem('selectedCloud');

    if (cloud === "azure" && accounts.length > 0) {
      try {
        await instance.logoutPopup({
          account: accounts[0],
          postLogoutRedirectUri: window.location.origin,
        });
        sessionStorage.clear(); // clear stored token and user data
        localStorage.clear();
        // navigate("/"); // redirect to login 
      } catch (error) {
        console.error("Azure logout failed:", error);
      } 
    } else {
      // For other clouds, just clear local and go back to login
      localStorage.clear();
      navigate("/");  
    }
  };

  return (
    <nav
      className={`fixed top-0 z-40 bg-gradient-to-l from-primary-900 via-primary-800 to-primary-700 px-4 py-3 flex justify-between h-12 transition-all duration-300 ${
        expanded ? "left-64" : "left-20"
      } right-0`}
    >
      <div className="flex items-center text-xl">
        {!expanded && (
          <span className="font-extrabold text-lg tracking-wide font-['Poppins',_sans-serif] bg-gradient-to-r from-primary-200 via-primary-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-md">
            Disaster Recovery
          </span>
        )}
      </div>

      <div className="flex items-center gap-x-5 relative">
        <div className="text-primary-100">
          <FaBell className="w-6 h-6" />
        </div>

        <div className="relative">
          <button
            className="text-primary-100 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaUserCircle className="w-6 h-6 mt-1" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 rounded-lg shadow-lg w-32 bg-primary-900 text-primary-100 border border-primary-700">
              <ul className="py-1 text-sm">
                <li className="hover:bg-primary-800 px-4 py-2 cursor-pointer">
                  Profile
                </li>
                <li className="hover:bg-primary-800 px-4 py-2 cursor-pointer">
                  Settings
                </li>
                <li
                  onClick={handleLogout}
                  className="hover:bg-primary-800 px-4 py-2 cursor-pointer text-red-400 font-semibold"
                >
                  Log Out
                </li>
              </ul>
            </div>
          )}
        </div>  
      </div>   
    </nav>                 
  );
}; 
 
export default Navbar;  
