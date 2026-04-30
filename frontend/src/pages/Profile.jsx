import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

export default function Profile(){
  const { user, logout } = useContext(AuthContext)
  if (!user) return <div className="container py-8">Not logged in</div>

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="mt-2"><strong>Name:</strong> {user.name}</p>
        <p className="mt-1"><strong>Email:</strong> {user.email}</p>
        <p className="mt-1"><strong>Role:</strong> {user.role}</p>
        <div className="mt-4">
          <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
        </div>
      </div>
    </div>
  )
}
