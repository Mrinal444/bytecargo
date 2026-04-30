import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'
import AuthContext from '../context/AuthContext'

export default function BidDetails(){
  const { id } = useParams()
  const [bid,setBid]=useState(null)
  const [submissions,setSubmissions]=useState([])
  const { user } = useContext(AuthContext)
  const [msg,setMsg]=useState('')

  useEffect(()=>{ fetch() }, [])

  async function fetch(){
    const res = await api.get(`/bids/${id}`)
    setBid(res.data)
    const s = await api.get(`/bids/${id}/submissions`)
    setSubmissions(s.data)
  }

  async function accept(subId){
    try{
      await api.post(`/bids/${id}/select/${subId}`)
      setMsg('Accepted')
      fetch()
    }catch(err){ setMsg(err?.response?.data?.error || err.message) }
  }

  if (!bid) return <div className="container py-8">Loading...</div>

  return (
    <div className="container py-8">
      <h2 className="text-xl font-semibold">{bid.title}</h2>
      <p className="text-sm text-gray-600">{bid.origin} → {bid.destination}</p>
      <div className="mt-4">
        <h3 className="font-medium">Submissions</h3>
        {msg && <div className="text-sm text-green-600">{msg}</div>}
        <div className="space-y-3 mt-2">
          {submissions.map(s=> (
            <div key={s.id} className="p-3 border rounded bg-white flex justify-between items-center">
              <div>
                <div className="font-medium">{s.transporter?.name}</div>
                <div className="text-sm text-gray-600">Price: ${s.price.toFixed(2)} — ETA: {s.estimatedTime} days</div>
                <div className="text-sm">Status: {s.status}</div>
              </div>
              {user?.id===bid.merchantId && s.status==='PENDING' && (
                <button onClick={()=>accept(s.id)} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
