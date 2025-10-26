import { NavLink } from 'react-router-dom'

function NavBar() {
  const base =
    'flex flex-col items-center justify-center text-xs font-medium flex-1 py-2'
  const active = 'text-indigo-600 dark:text-indigo-400'
  const inactive = 'text-neutral-500 dark:text-neutral-400'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-neutral-200 bg-white/80 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80">
      <NavLink
        to="/"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <span>Hoy</span>
      </NavLink>

      <NavLink
        to="/library"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <span>Guía</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <span>Ajustes</span>
      </NavLink>
    </nav>
  )
}

export default NavBar
