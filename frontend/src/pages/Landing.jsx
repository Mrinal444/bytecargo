import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold">ByteCargo — Logistics Bidding</h1>
        <p className="mt-4 text-gray-600">Merchants post shipments. Transporters bid. Accept a transporter to assign.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" className="px-4 py-2 border rounded">Login</Link>
          <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
