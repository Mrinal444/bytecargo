import React, { useEffect, useState } from 'react'
import api from '../api/api'
import BidCard from '../components/BidCard'
import Modal from '../components/Modal'

export default function TransporterDashboard(){
  const [bids,setBids]=useState([])
  const [loading,setLoading]=useState(true)
  const [selected,setSelected]=useState(null)
  const [price,setPrice]=useState('')
  const [eta,setEta]=useState('')
  const [msg,setMsg]=useState('')

  useEffect(()=>{ fetchOpen() }, [])

  async function fetchOpen(){ setLoading(true); const res = await api.get('/bids'); setBids(res.data); setLoading(false) }

  async function submit(){
    try{
      await api.post(`/bids/${selected.id}/submit`, { price, estimatedTime: eta })
      setSelected(null); setPrice(''); setEta(''); setMsg('Submitted')
    }catch(err){ setMsg(err?.response?.data?.error || err.message) }
  }

  return (
    <div className="container py-8">
      <h2 className="text-xl font-semibold">Open Bids</h2>
      {loading ? <div className="mt-4">Loading...</div> : (
        <div className="grid gap-3 mt-4">
          {bids.map(b=> (
            <div key={b.id} className="flex items-start gap-3">
              <div className="flex-1"><BidCard bid={b} /></div>
              <div className="self-center">
                <button onClick={()=>setSelected(b)} className="px-3 py-1 bg-indigo-600 text-white rounded">Submit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?`Submit for ${selected.title}`:'Submit'}>
        <div>
          {msg && <div className="text-sm text-green-600 mb-2">{msg}</div>}
          <label className="block text-sm">Price</label>
          <input className="w-full border p-2 mb-2" value={price} onChange={e=>setPrice(e.target.value)} />
          <label className="block text-sm">Estimated time (days)</label>
          <input className="w-full border p-2 mb-2" value={eta} onChange={e=>setEta(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <button onClick={()=>setSelected(null)} className="px-3 py-1 border rounded">Cancel</button>
            <button onClick={submit} className="px-3 py-1 bg-indigo-600 text-white rounded">Submit</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
