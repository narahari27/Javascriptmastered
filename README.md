import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./AuthConfig";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DBConfig } from "./DBConfig";
import { initDB } from "react-indexed-db-hook";initDB(DBConfig);export const msalInstance = new PublicClientApplication(msalConfig);const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
<App />
</React.StrictMode>
);// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

create-react-app.dev

Measuring Performance | Create React App

By default, Create React App includes a performance relayer that allows you to measure and analyze (9 kB)
