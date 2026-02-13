import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { ArticleProvider } from "./context/ArticleContext";

createRoot(document.getElementById("root")).render(
    <HelmetProvider>
        <ArticleProvider>
            <App />
        </ArticleProvider>
    </HelmetProvider>
);
