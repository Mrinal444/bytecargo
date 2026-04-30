import React, { useState, useEffect, useContext } from 'react'
import api from '../api/api'
import AuthContext from '../context/AuthContext'
import BidCard from '../components/BidCard'

export default function MerchantDashboard(){
  const { user } = useContext(AuthContext)
  const [title,setTitle]=useState('')
  const [origin,setOrigin]=useState('')
  const [destination,setDestination]=useState('')
  const [price,setPrice]=useState('')
  const [error,setError]=useState('')
  const [bids,setBids]=useState([])

  useEffect(()=>{ fetchMyBids() }, [])

  async function fetchMyBids(){
    const res = await api.get('/my-bids')
    setBids(res.data)
  }

  async function create(e){
    e.preventDefault(); setError('')
    try{
      await api.post('/bids', { title, origin, destination, price })
      setTitle(''); setOrigin(''); setDestination(''); setPrice('')
      fetchMyBids()
    }catch(err){ setError(err?.response?.data?.error || err.message) }
  }

  return (
    <div className="container py-8">
      <h2 className="text-xl font-semibold">Merchant Dashboard</h2>
      <p className="text-sm text-gray-600">Welcome, {user?.name}</p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-3">Create Bid</h3>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <form onSubmit={create}>
            <input placeholder="Title" className="w-full border p-2 mb-2" value={title} onChange={e=>setTitle(e.target.value)} />
            <input placeholder="Origin" className="w-full border p-2 mb-2" value={origin} onChange={e=>setOrigin(e.target.value)} />
            <input placeholder="Destination" className="w-full border p-2 mb-2" value={destination} onChange={e=>setDestination(e.target.value)} />
            <input placeholder="Price" className="w-full border p-2 mb-2" value={price} onChange={e=>setPrice(e.target.value)} />
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
          </form>
        </div>

        <div>
          <h3 className="font-medium mb-3">My Bids</h3>
          <div className="space-y-3">
            {bids.length===0 && <div className="text-sm text-gray-600">No bids yet</div>}
            {bids.map(b=> (
              <div key={b.id}>
                <BidCard bid={b} />
                <div className="mt-2 text-right"><a className="text-sm text-indigo-600" href={`/bids/${b.id}`}>View submissions</a></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
