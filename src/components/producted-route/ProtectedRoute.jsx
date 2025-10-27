import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

function ProtectedRoute({ children }) {
  const isAuthenticated = useIsAuthenticated(); // ✅ Azure login check

  // ✅ Get selected cloud (and handle null safely)
  const selectedCloud = localStorage.getItem("selectedCloud");
  const sessionToken = sessionStorage.getItem("accessToken");

  const cloud = selectedCloud ? selectedCloud.toLowerCase() : "";  
  console.log(isAuthenticated, "isAuthenticated");   
                          
  const isAWS = cloud === "aws";   
  const isGCP = cloud === "gcp";   

  // ✅ Allow access if Azure is authenticated OR cloud is AWS/GCP
  if (isAuthenticated || sessionToken || isAWS || isGCP) {
    return children;  
  } 

   // ❌ Not allowed → redirect to login    
  return <Navigate to="/" replace />;        
}       

export default ProtectedRoute;   
