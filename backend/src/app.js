const express = require('express')

const app = express()

app.use(express.json())

app.post('/login', (req, res) => {
    const username = req.body.username;
    const role = req.body.role;
    console.log("Backend server connected")
    res.status(200).json({
        message: "Request created",
        username: username,
        Role: role
    })
})

module.exports = app;