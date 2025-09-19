import "./index.css";              // <-- IMPORTA TAILWIND ANTES QUE NADA

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./MobilePlanGiovanni.jsx";

// Registro del PWA (no toca CSS)
import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
