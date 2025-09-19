import React from "react";

/**
 * Toggle de tema (claro/oscuro) con persistencia en localStorage.
 * - Aplica/quita la clase 'dark' en <html>.
 * - Muestra el icono y texto del modo que se activará al pulsar.
 */
export default function ThemeToggle() {
  const getInitial = () => {
    if (typeof window === "undefined") return "light";
    const ls = localStorage.getItem("theme");
    if (ls === "light" || ls === "dark") return ls;
    const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return systemDark ? "dark" : "light";
  };

  const [theme, setTheme] = React.useState(getInitial);

  // Mantén la clase en <html> y guarda en localStorage
  React.useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  // (Opcional) Reaccionar a cambios del sistema si el usuario no fijó preferencia
  React.useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;
    const handler = (e) => {
      const saved = localStorage.getItem("theme");
      if (!saved) setTheme(e.matches ? "dark" : "light");
    };
    media.addEventListener?.("change", handler);
    return () => media.removeEventListener?.("change", handler);
  }, []);

  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  const onToggle = () => setTheme(nextTheme);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="toggle"
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
    >
      {/* Mostramos el icono del modo que se activará */}
      {isDark ? (
        /* Activar claro -> Sol */
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2m0 16v2M4.93 4.93 6.34 6.34M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07 6.34 17.66M17.66 6.34l1.41-1.41"></path>
        </svg>
      ) : (
        /* Activar oscuro -> Luna */
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path>
        </svg>
      )}
      <span className="text-sm">{isDark ? "Claro" : "Oscuro"}</span>
    </button>
  );
}
