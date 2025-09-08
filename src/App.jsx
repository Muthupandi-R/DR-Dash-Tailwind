import React, { useState } from "react";
import SidebarLayout from "./components/common/SidebarLayout";
import Navbar from "./components/common/Navbar";

export default function App({ children }) {
  const [expanded, setExpanded] = useState(true);
   // clone children to pass props into routed component
  const enhancedChildren = React.cloneElement(children, { setExpanded });
  return (
    <div className="flex w-full">
      <SidebarLayout expanded={expanded} setExpanded={setExpanded}/>
      <div className={`flex-1 transition-all duration-300 ${expanded ? "ml-64" : "ml-20"}`}>
        <Navbar expanded={expanded}/>
        <main className="p-4 bg-primary-300 w-full min-h-screen overflow-y-auto">{enhancedChildren}</main>
      </div>
    </div>
  );
}
