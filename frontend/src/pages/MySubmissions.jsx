import React, { useEffect, useState } from 'react'
import api from '../api/api'

export default function MySubmissions(){
  const [subs,setSubs]=useState([])
  useEffect(()=>{ api.get('/my-submissions').then(r=>setSubs(r.data)) }, [])
  return (
    <div className="container py-8">
      <h2 className="text-xl font-semibold">My Submissions</h2>
      <div className="mt-4 space-y-3">
        {subs.map(s=> (
          <div key={s.id} className="p-3 border rounded bg-white">
            <div className="font-medium">{s.bid?.title}</div>
            <div className="text-sm text-gray-600">Price: ${s.price.toFixed(2)} — ETA: {s.estimatedTime} days</div>
            <div className="text-sm">Status: {s.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
