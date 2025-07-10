// components/SidebarLayout.jsx
import { SlSpeedometer, SlBubbles, SlEnergy } from "react-icons/sl";
import { LifeBuoy, Settings } from "lucide-react";
import { SiAmazondynamodb, SiKubernetes } from "react-icons/si";
import { FiBookOpen } from "react-icons/fi";
import Sidebar, { SidebarItem } from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";

export default function SidebarLayout({ expanded, setExpanded}) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  return (
    <Sidebar expanded={expanded} setExpanded={setExpanded}>
      <SidebarItem
        icon={<SlSpeedometer size={20} className="text-blue-500" />}
        text="Dashboard"
        onClick={() => navigate("/dashboard")}
        active={currentPath === "/dashboard"}
      />
      <SidebarItem
        icon={<SlEnergy size={20} className="text-yellow-500" />}
        text="Initiate DR"
        onClick={() => navigate("/initiatedr")}
        active={currentPath === "/initiatedr"}
      />
      <SidebarItem
        icon={<SiAmazondynamodb size={20} className="text-purple-500" />}
        text="Capacity Planning"
        onClick={() => navigate("/capacity-plan")}
        active={currentPath === "/capacity-plan"}
      />
      <SidebarItem
        icon={<SlBubbles size={20} className="text-green-500" />}
        text="Teams"
        onClick={() => navigate("/teams")}
        active={currentPath === "/teams"}
      />
      <SidebarItem
        icon={<FiBookOpen size={20} className="text-pink-500" />}
        text="DR Run Book"
        onClick={() => navigate("/dr-runbook")}
        active={currentPath === "/dr-runbook"}
      />
      <SidebarItem
        icon={<SiKubernetes size={20} className="text-cyan-500" />}
        text="Kubernetes"
        onClick={() => navigate("/kubernetes")}
        active={currentPath === "/kubernetes"}
      />
      <hr className="my-3" />
      <SidebarItem
        icon={<Settings size={20} className="text-primary-500" />}
        text="Settings"
        onClick={() => navigate("/settings")}
      />
      <SidebarItem
        icon={<LifeBuoy size={20} className="text-orange-500" />}
        text="Help"
        onClick={() => navigate("/help")}
      />
    </Sidebar>
  );
}
