import React, { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { account } from './api/appwrite'
import Login from './pages/Login.jsx'
import Editor from './pages/Editor.jsx'
import MyPatterns from './pages/MyPatterns.jsx'
import ViewPattern from './pages/ViewPattern.jsx'

function Header({ user, onLogout }) {
  return (
    <header className="container">
      <h1>🟪 Pixel Art App</h1>
      <nav>
        {user && <NavLink to="/editor" className={({isActive}) => isActive ? 'active' : ''}>Edytor</NavLink>}
        {user && <NavLink to="/my" className={({isActive}) => isActive ? 'active' : ''}>Moje wzory</NavLink>}
        {!user && <NavLink to="/login" className={({isActive}) => isActive ? 'active' : ''}>Zaloguj</NavLink>}
        {user && <button className="secondary" onClick={onLogout}>Wyloguj</button>}
      </nav>
    </header>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    account.get().then(setUser).catch(() => setUser(null))
  }, [])

  async function handleLogout() {
    try {
      await account.deleteSession('current')
    } catch {}
    setUser(null)
    navigate('/login')
  }

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />
      <main className="container">
        <Routes>
          <Route path="/" element={user ? <Editor user={user} /> : <Login onAuth={setUser} />} />
          <Route path="/login" element={<Login onAuth={setUser} />} />
          <Route path="/editor" element={user ? <Editor user={user} /> : <Login onAuth={setUser} />} />
          <Route path="/my" element={user ? <MyPatterns user={user} /> : <Login onAuth={setUser} />} />
          <Route path="/pattern/:id" element={user ? <ViewPattern user={user} /> : <Login onAuth={setUser} />} />
        </Routes>
      </main>
    </div>
  )
}
