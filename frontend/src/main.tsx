
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react';
import {Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Toaster />
            <App />

    </React.StrictMode>
)
