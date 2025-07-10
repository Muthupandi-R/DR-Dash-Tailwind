import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import awsLogo from "../assets/aws-logo.png";
import azureLogo from "../assets/azure-logo.png";
import gcpLogo from "../assets/gcp-logo.png";
import azureFunctionAppIcon from "../assets/azure-function-app.png";
import azureAksIcon from "../assets/azure-aks.png";
import awsLambdaIcon from "../assets/aws-lambda.png";
import gcpSqlIcon from "../assets/gcp-sql.png";
import './dashboard/AnimatedLogin.css';

const clouds = [
  {
    name: "AWS",
    logo: awsLogo,
    bg: "bg-gradient-to-tr from-yellow-400 to-yellow-600",
    ring: "ring-yellow-400/60",
    shadow: "shadow-yellow-300/40",
  },
  {
    name: "Azure",
    logo: azureLogo,
    bg: "bg-gradient-to-tr from-blue-500 to-blue-800",
    ring: "ring-blue-400/60",
    shadow: "shadow-blue-400/40",
  },
  {
    name: "GCP",
    logo: gcpLogo,
    bg: "bg-gradient-to-tr from-orange-400 to-red-500",
    ring: "ring-orange-400/60",
    shadow: "shadow-orange-300/40",
  },
];

// Resource icons for floating animation
const resourceIcons = [
  { icon: azureFunctionAppIcon, name: "Azure Function", delay: 0 },
  { icon: azureAksIcon, name: "AKS", delay: 2 },
  { icon: awsLambdaIcon, name: "Lambda", delay: 4 },
  { icon: gcpSqlIcon, name: "GCP SQL", delay: 6 },
  { icon: azureFunctionAppIcon, name: "Azure VM", delay: 8 },
  { icon: awsLambdaIcon, name: "EC2", delay: 10 },
];

function CloudCard({ cloud, onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `rotateY(${x / 12}deg) rotateX(${-y / 16}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = "";
  };

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col items-center justify-center w-64 h-64 rounded-2xl ${cloud.bg} shadow-xl ${cloud.shadow} transition-all duration-300 hover:ring-4 ${cloud.ring} focus:outline-none overflow-hidden shine-effect backdrop-blur-sm`}
      style={{ 
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        background: `${cloud.bg} linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`
      }}
    >
      <div className="flex items-center justify-center w-28 h-28 bg-white/90 rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
        <img src={cloud.logo} alt={cloud.name + " logo"} className="w-20 h-20 object-contain" />
      </div>
      <span className="text-3xl font-bold text-white drop-shadow-lg tracking-wide">{cloud.name}</span>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Click to enter {cloud.name} dashboard
      </span>
      <span className="shine absolute inset-0 pointer-events-none" />
    </button>
  );
}

function FloatingIcon({ icon, name, delay, position }) {
  return (
    <div 
      className={`absolute floating-icon opacity-60 hover:opacity-100 transition-opacity duration-300`}
      style={{
        left: position.x + '%',
        top: position.y + '%',
        animationDelay: delay + 's',
        animationDuration: (15 + Math.random() * 10) + 's'
      }}
    >
      <img 
        src={icon} 
        alt={name} 
        className="w-12 h-12 object-contain drop-shadow-lg filter brightness-110"
        title={name}
      />
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();

  // Generate positions for floating icons with better spacing between them
  const floatingPositions = [
    { x: 15, y: 25 },   // Top left
    { x: 85, y: 20 },   // Top right
    { x: 15, y: 75 },   // Bottom left
    { x: 80, y: 80 },   // Bottom right
    { x: 50, y: 15 },   // Top center
    { x: 45, y: 85 }    // Bottom center
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-blob1"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-blob2"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-blob3"></div>
        
        {/* Floating resource icons */}
        {resourceIcons.map((resource, index) => (
          <FloatingIcon
            key={index}
            icon={resource.icon}
            name={resource.name}
            delay={resource.delay}
            position={floatingPositions[index]}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-4 text-center animate-portal-glow">
          Cloud Dashboard
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 drop-shadow-lg mb-12 text-center animate-portal-glow">
          Select your cloud provider to continue
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl justify-center items-center">
          {clouds.map((cloud) => (
            <CloudCard
              key={cloud.name}
              cloud={cloud}
              onClick={() => navigate("/dashboard")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}