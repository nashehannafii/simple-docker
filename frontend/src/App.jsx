import React, { useEffect, useState } from "react"

// Use Vite env var when provided; otherwise default to same host with port 5001
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:5001`

export default function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const url = `${BACKEND_URL}/users`
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setUsers)
      .catch((err) => console.error("Failed to fetch users:", err))
  }, [])

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>Simple React Frontend</h1>
      <p>Users from API:</p>
      <p>
        API source: <a href={`${BACKEND_URL}/`} target="_blank" rel="noreferrer">{BACKEND_URL}</a>
      </p>
      <p>
        Quick links: <a href={`${BACKEND_URL}/users`} target="_blank" rel="noreferrer">/users</a> |
        <a style={{ marginLeft: 6 }} href={`${BACKEND_URL}/health`} target="_blank" rel="noreferrer">/health</a>
      </p>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
      {users.length === 0 && <p>(no users or API unreachable)</p>}
    </div>
  )
}
