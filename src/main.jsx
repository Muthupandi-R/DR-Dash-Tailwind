import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import InitiateDr from "./components/initiate-dr/InitiateDr.jsx";
import CapacityPlan from "./components/capacity-planning/CapacityPlan.jsx";
import Msteams from "./components/teams/Msteams.jsx";
import Runbook from "./components/run-book/RunBook.jsx";
import Kubernetes from "./components/kubernetes/Kubernetes.jsx";
import Login from "./components/Login/Login.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ToastManager from "./components/toast/ToastManager.jsx";
import { ContextProvider } from "./context/ContextApi.jsx";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig.js";
import ProtectedRoute from "./components/producted-route/ProtectedRoute.jsx";

const msalInstance = new PublicClientApplication(msalConfig);

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <App>
          <Dashboard />
        </App>
      </ProtectedRoute>
    ),
  },
  {
    path: "/initiatedr",
    element: (
      <ProtectedRoute>
        <App>
          <InitiateDr />
        </App>
      </ProtectedRoute>
    ),
  },
  {
    path: "/capacity-plan",
    element: (
      <ProtectedRoute>
        <App>
          <CapacityPlan />
        </App>
      </ProtectedRoute>
    ),
  },
  {
    path: "/teams",
    element: (
      <ProtectedRoute>
        <App>
          <Msteams />
        </App>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dr-runbook",
    element: (
      <ProtectedRoute>
        <App>
          <Runbook />
        </App>
      </ProtectedRoute>
    ),
  },
  {
    path: "/kubernetes",
    element: (
      <ProtectedRoute>
        <App>
          <Kubernetes />
        </App>
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <ContextProvider>
        <ToastManager />                        
        <RouterProvider router={router} />         
      </ContextProvider>
    </MsalProvider>          
  </React.StrictMode>          
);     
