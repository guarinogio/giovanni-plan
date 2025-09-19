import React from "react";

/**
 * Grupo de opciones tipo “segmented control”.
 * Ahora se centra por defecto gracias a `mx-auto` y se adapta al ancho disponible.
 */
export default function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="toggle-group mx-auto max-w-xs w-full">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={
              "px-3 py-1.5 rounded-lg transition-colors w-full text-center " +
              (active ? "toggle-active" : "opacity-70 hover:opacity-100")
            }
          >
            <span className="block truncate">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
