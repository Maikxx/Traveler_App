const helmet = require('helmet')
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

console.log('(Re)starting API...')

// Start an express app.
const app = express()

app.use(cors())
app.use(helmet())
app.get('/locations', (req, res, next) => {
    const fetchLocations = (() => {
            fetch('http://localhost:8000/locations')
                .then(data => data.json())
                .then(data => res.status(200).json(data))
                .catch(error => {
                    console.error(error)
                    res.status(500).json({
                        error: 'No data found!',
                    })
                })
    })()
})

// Serving
app.listen(5000)
