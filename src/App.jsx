import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import TodayPage from './pages/TodayPage.jsx'
import CoreSessionPage from './pages/CoreSessionPage.jsx'
import CardioSessionPage from './pages/CardioSessionPage.jsx'
import StrengthSessionPage from './pages/StrengthSessionPage.jsx'
import MobilitySessionPage from './pages/MobilitySessionPage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import NavBar from './components/NavBar.jsx'
import useAppStore from './state/useAppStore.js'

function App() {
  const theme = useAppStore((s) => s.theme || 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/core" element={<CoreSessionPage />} />
          <Route path="/cardio" element={<CardioSessionPage />} />
          <Route path="/strength/:routine" element={<StrengthSessionPage />} />
          <Route path="/mobility" element={<MobilitySessionPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <NavBar />
    </div>
  )
}

export default App
