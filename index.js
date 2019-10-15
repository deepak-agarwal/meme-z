const express = require('express')
const mongoose = require('./config/database')
const router = require('./config/routes')
const cors = require('cors')
const app= express()

app.use(express.json())
app.use(cors())

const port = 3005

app.use('/',router)

app.listen(port,()=>{
    console.log('Listening on port ', port)
})