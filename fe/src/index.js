import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
// import context
import { ModeThemeProvider } from './context/ModeThemeContext';
import { UserProvider } from './context/UserContext';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <ModeThemeProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </ModeThemeProvider>
  // </React.StrictMode>
);

