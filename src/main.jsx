import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Dashboard from "./components/dashboard/Dashboard.jsx"
import InitiateDr from './components/initiate-dr/InitiateDr.jsx'
import CapacityPlan from './components/capacity-planning/CapacityPlan.jsx'
import Msteams from './components/teams/Msteams.jsx'
import Runbook from './components/run-book/RunBook.jsx'
import Kubernetes from './components/kubernetes/Kubernetes.jsx'
import Login from './components/Login.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ToastManager from './components/toast/ToastManager.jsx'
import { WebSocketProvider } from './context/ContextApi.jsx'


const router = createBrowserRouter([
  {path: "/" , element: <Login />},
  {path: "/dashboard" , element: <App><Dashboard /></App>},
  {path: "/initiatedr" , element: <App><InitiateDr /></App>},
  {path: "/capacity-plan" , element: <App><CapacityPlan /></App>},
  {path: "/teams" , element: <App><Msteams /></App>},
  {path: "/dr-runbook" , element: <App><Runbook /></App>},
  {path: "/kubernetes" , element: <App><Kubernetes /></App>},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WebSocketProvider>
      <ToastManager />
    <RouterProvider router={router}/>
    </WebSocketProvider>
  </React.StrictMode>,
)
