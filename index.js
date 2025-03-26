import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('profile.ejs')
    // res.render('index.ejs')
})

app.get('/searcher', (req, res) => {
    res.render('./partials/searcher.ejs', {apiKey: process.env.API_KEY})
})

app.get('/profile', (req, res) => {
    res.render('profile.ejs')
})

app.listen(PORT, () => {
    console.log('http://localhost:3000/')
})