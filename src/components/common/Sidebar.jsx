import { ChevronFirst, ChevronLast } from "lucide-react"
import logo from "../../assets/loginIcons/d-logo.png"  
import { createContext, useContext } from "react"

const SidebarContext = createContext();

export default function Sidebar({ expanded, setExpanded, children }) {
    return (
        <>
            <aside className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ${expanded ? "w-64" : "w-20"}`}>
                <nav className="h-full flex flex-col bg-gradient-to-t from-primary-900 via-primary-800 to-primary-700 border-primary-800 shadow-xl">
                    <div className="p-4 pb-2 flex items-center justify-between">
                        <div className={`flex items-center transition-all duration-300 ${expanded ? "gap-2" : "justify-center w-full"}`}>
                            <div className={`flex items-center justify-center bg-gradient-to-br from-primary-200 via-cyan-200 to-primary-400 shadow-lg border border-primary-100 transition-all duration-300
                                ${expanded ? "w-8 h-12 rounded-full" : "w-16 h-16 rounded-full"}`}>
                                <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                            </div>
                            <span
                                className={`transition-all origin-left font-extrabold text-md tracking-wide font-['Poppins',_sans-serif] bg-gradient-to-r from-primary-200 via-primary-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-md
                                    ${expanded ? "opacity-100 ml-2 w-auto" : "opacity-0 ml-0 w-0"}`}
                                style={{ transitionProperty: "opacity, margin, width" }}
                            >
                                Disaster Recovery
                            </span>
                        </div>
                    </div>
                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>
                </nav>
            </aside>

            {/* Floating Chevron Button */}
            <button
                onClick={() => setExpanded((curr) => !curr)}
                className={`
                    fixed z-50 top-1/2 -translate-y-1/2
                    ${expanded ? "left-64" : "left-20"}
                    w-8 h-8 flex items-center justify-center
                    rounded-full bg-gradient-to-br from-primary-200 via-primary-200 to-primary-100
                    shadow-md border border-primary-300
                    hover:from-primary-300 hover:to-primary-200
                    transition-all cursor-pointer
                `}
                aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                style={{ marginLeft: '-16px' }} // overlap the edge a bit for a floating look
            >
                <ChevronFirst
                    className={`text-primary-700 w-4 h-4 transition-transform ${expanded ? "rotate-0" : "rotate-180"}`}
                />
            </button>
        </>
    )
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
    const { expanded } = useContext(SidebarContext)
    return (
        <li
  onClick={onClick}
  className={`relative flex items-center h-10 py-2 px-4 my-1 font-semibold rounded-md cursor-pointer transition-all duration-200 group
    ${active
      ? "bg-primary-800 border-l-4 border-primary-400 shadow-md scale-105 text-primary-50"
      : "hover:bg-primary-700/60 hover:border-l-4 hover:border-primary-300 hover:scale-105 text-primary-200"}
  `}
>
  {icon}
  <span className={`overflow-hidden transition-all ${expanded ? "text-sm w-52 ml-3" : "w-0"}`}>
    {text}
  </span>
  {alert && (
    <div className={`absolute right-2 w-2 h-2 rounded bg-primary-400 ${expanded ? "" : "top-2"}`}></div>
  )}
  {!expanded && (
    <div
  className={`absolute left-full top-1/2 -translate-y-1/2 rounded-md px-2 py-1 ml-6 bg-primary-800 text-primary-100 text-sm invisible opacity-20 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap max-w-xs`}
>
  {text}
</div>
  )}
</li>
    )
}