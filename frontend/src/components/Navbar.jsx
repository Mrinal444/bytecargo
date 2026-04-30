import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const nav = useNavigate()

  function onLogout() {
    logout()
    nav('/')
  }

  return (
    <nav className="bg-white border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-semibold">ByteCargo</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.name} ({user.role})</span>
              <button onClick={onLogout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
              <Link to="/signup" className="px-3 py-1 bg-indigo-600 text-white rounded">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
