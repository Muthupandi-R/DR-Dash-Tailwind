export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin, // e.g., http://localhost:3000
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage", // persist login
    storeAuthStateInCookie: false,  
  },
};

export const loginRequest = {
  scopes: ["User.Read"], 
};  
     