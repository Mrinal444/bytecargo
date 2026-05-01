import React from 'react'
import { Link } from 'react-router-dom'

export default function BidCard({ bid }) {
  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{bid.title}</h3>
          <p className="text-sm text-gray-600">{bid.origin} → {bid.destination}</p>
          <p className="mt-2 font-medium">₹{Number(bid.price).toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">{bid.merchant?.name}</p>
          <Link to={`/bids/${bid.id}`} className="mt-2 inline-block px-3 py-1 bg-indigo-600 text-white rounded text-sm">View</Link>
        </div>
      </div>
    </div>
  )
}
