import React from 'react'

export default function Toast({ message, type = 'info' }) {
  if (!message) return null
  const bg = type === 'error' ? 'bg-red-500' : 'bg-green-500'
  return (
    <div className={`fixed bottom-6 right-6 px-4 py-2 text-white rounded ${bg}`}>
      {message}
    </div>
  )
}
