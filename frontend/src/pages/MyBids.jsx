import React, { useEffect, useState } from 'react'
import api from '../api/api'
import BidCard from '../components/BidCard'

export default function MyBids(){
  const [bids,setBids]=useState([])
  useEffect(()=>{ api.get('/my-bids').then(r=>setBids(r.data)) }, [])
  return (
    <div className="container py-8">
      <h2 className="text-xl font-semibold">My Bids</h2>
      <div className="mt-4 space-y-3">
        {bids.map(b=> <BidCard key={b.id} bid={b} />)}
      </div>
    </div>
  )
}
