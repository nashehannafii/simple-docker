const express = require('express')
const mysql = require('mysql2/promise')

const app = express()
const cors = require('cors')

// Allow requests from frontend during development. For production, lock this down.
app.use(cors())
const PORT = process.env.PORT || 8000

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5555,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'testdb',
}

let pool

async function initDb() {
  pool = mysql.createPool({ ...dbConfig, waitForConnections: true, connectionLimit: 5 })
  const conn = await pool.getConnection()
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `)
    const [rows] = await conn.query('SELECT COUNT(*) as cnt FROM users')
    if (rows[0].cnt === 0) {
      await conn.query("INSERT INTO users (name) VALUES ('Alice'), ('Bob')")
    }
  } finally {
    conn.release()
  }
}

app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM users')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
})

app.get('/health', async (req, res) => {
  try {
    const conn = await pool.getConnection()
    await conn.ping()
    conn.release()
    res.json({ status: 'ok' })
  } catch (err) {
    console.error('health check failed', err)
    res.status(500).json({ status: 'error', detail: err.message })
  }
})

initDb()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Express backend listening on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to initialize DB', err)
    process.exit(1)
  })
