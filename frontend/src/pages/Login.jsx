import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const { login } = useContext(AuthContext)
  const nav = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    try{
      await login(email,password)
      nav('/')
    }catch(err){
      setError(err?.response?.data?.error || err.message)
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={onSubmit}>
          <label className="block mb-2 text-sm">Email</label>
          <input className="w-full border p-2 mb-3" value={email} onChange={e=>setEmail(e.target.value)} />
          <label className="block mb-2 text-sm">Password</label>
          <input type="password" className="w-full border p-2 mb-3" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="w-full bg-indigo-600 text-white py-2 rounded">Login</button>
        </form>
      </div>
    </div>
  )
}
