import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MerchantDashboard from './pages/MerchantDashboard'
import TransporterDashboard from './pages/TransporterDashboard'
import Profile from './pages/Profile'
import BidDetails from './pages/BidDetails'
import MyBids from './pages/MyBids'
import MySubmissions from './pages/MySubmissions'
import AuthContext from './context/AuthContext'

function Protected({ children }){
  const { user, loading } = useContext(AuthContext)
  if (loading) return <div className="p-8">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/merchant" element={<Protected><MerchantDashboard /></Protected>} />
        <Route path="/transporter" element={<Protected><TransporterDashboard /></Protected>} />

        <Route path="/bids/:id" element={<Protected><BidDetails /></Protected>} />
        <Route path="/my-bids" element={<Protected><MyBids /></Protected>} />
        <Route path="/my-submissions" element={<Protected><MySubmissions /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />

        <Route path="*" element={<div className="p-8">Not Found</div>} />
      </Routes>
    </div>
  )
}
