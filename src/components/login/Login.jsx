import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import awsLogo from "../../assets/loginIcons/aws-logo.png";
import azureLogo from "../../assets/loginIcons/azure-logo.png";
import gcpLogo from "../../assets/loginIcons/gcp-logo.png";
import azureFunctionAppIcon from "../../assets/loginIcons/azure-function-app.png";
import azureAksIcon from "../../assets/loginIcons/azure-aks.png";
import awsLambdaIcon from "../../assets/loginIcons/aws-lambda.png";
import gcpSqlIcon from "../../assets/loginIcons/gcp-sql.png";
import awsEc2Icon from "../../assets/loginIcons/aws-ec2.png";
import gcpComputeEngineIcon from "../../assets/loginIcons/gcp-compute-engine.png";
import './AnimatedLogin.css';
import earthGif from '../../assets/loginIcons/earth-rotate.gif'; // adjust path if needed
import { useContext } from "react";
import ContextApi from "../../context/ContextApi";
export default function Login() {
  const { handleCloudChange } = useContext(ContextApi);
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
    { icon: gcpComputeEngineIcon, name: "Gcp VM", delay: 0 },
    { icon: awsLambdaIcon, name: "Aws Lambda", delay: 4 },
    { icon: azureAksIcon, name: "Azure AKS", delay: 2 },
    { icon: gcpSqlIcon, name: "GCP SQL", delay: 6 },
    { icon: azureFunctionAppIcon, name: "Azure Function", delay: 8 },
    { icon: awsEc2Icon, name: "Aws EC2", delay: 10 },
  ];
  
  function CloudCard({ cloud, onClick }) {
    const cardRef = useRef(null);

    return (
      <button
        ref={cardRef}
        onClick={onClick}
        className={`group relative flex flex-col items-center justify-center w-55 h-60 rounded-2xl ${cloud.bg} shadow-xl ${cloud.shadow} transition-all duration-300 hover:ring-4 ${cloud.ring} focus:outline-none overflow-hidden shine-effect backdrop-blur-sm card-entrance`}
        style={{ 
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
        }}
      >
        <div className="flex items-center justify-center w-20 h-20 bg-white/90 rounded-full mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <img src={cloud.logo} alt={cloud.name + " logo"} className="w-14 h-14 object-contain" />
        </div>
        <span className="text-2xl font-bold text-white drop-shadow-lg tracking-wide">{cloud.name}</span>
        <span className="w-20 absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
  const navigate = useNavigate();
  const handleCloudClick = (provider) => {
    handleCloudChange(provider);
    navigate("/dashboard");
  };

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-primary-800 relative overflow-hidden">
      {/* Earth GIF background, left side */}
      <img
        src={earthGif}
        alt="Earth"
        className="absolute left-0 bottom-0 w-1/3 max-w-xs opacity-80 pointer-events-none select-none"
        style={{ zIndex: 1 }}
      />
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-blob1"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-blob2"></div>
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
        <h1 className="relative text-5xl md:text-6xl font-extrabold mb-4 text-center overflow-hidden">
          <span
            className="inline-block bg-[linear-gradient(110deg,#a5f3fc,60%,#fff,80%,#c4b5fd)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shine"
            style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
          >
            Disaster Recovery
          </span>
        </h1>
        <p className="text-xl md:text-2xl bg-gradient-to-r from-primary-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg mb-12 text-center animate-fade-in">
          Select your cloud provider to continue
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl justify-center items-center">
          {clouds.map((cloud) => (
            <CloudCard
              key={cloud.name}
              cloud={cloud}
              onClick={() => handleCloudClick(cloud.name.toLowerCase())}
            />
          ))}
        </div>
      </div>
    </div>
  );
}