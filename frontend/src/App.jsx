import React, { useEffect, useState } from "react"

export default function App() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    // For local development this points to backend on host (docker-compose maps 8000)
    // backend is mapped to host port 5001 in the compose files
    fetch("http://localhost:5001/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error(err))
  }, [])

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>Simple React Frontend</h1>
      <p>Users from API:</p>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  )
}
