const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send("This is the backend server!")
})

app.post('/', (req, res) => {
    
    res.send("This is the backend server!")
})

module.exports = app;