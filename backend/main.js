const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

const port = 5000

const AuthRouter = require('./router/Auth_router')
const AddStoreRouter = require('./router/Add_Store_Router')
const StoreRatingRouter = require('./router/StoreRating_router')

// MySQL connection
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',        
  password: '',        
  database: 'roxiler_coding_challenge'
})

connection.getConnection()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Error while connecting database", err))

// ✅ middleware to attach connection to every req
app.use((req, res, next) => {
  req.db = connection
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', AuthRouter)
app.use('/api', AddStoreRouter)
app.use('/api', StoreRatingRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
