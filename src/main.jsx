import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./MobilePlanGiovanni.jsx";

// Registro del SW con flujo de actualización
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Muestra un prompt básico; puedes reemplazar por un toast bonito
    const ok = confirm("Hay una nueva versión disponible. ¿Actualizar ahora?");
    if (ok) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    // Puedes mostrar un aviso: "Listo para usarse sin conexión"
    console.log("PWA lista para uso offline");
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
