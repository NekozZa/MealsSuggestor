import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('view engine', 'ejs')
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/searcher', (req, res) => {
    res.render('searcher.ejs')
})

app.post('/meals', async (req, res) => {
    
    const params = new URLSearchParams({apiKey: process.env.API_KEY, ...req.body})
    const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?${params}`, {method: 'GET'})
    const data = await response.json()
    console.log(data)
    res.json({meals: data})
})

app.get('/profile', (req, res) => {
    res.render('profile.ejs')
})

app.listen(PORT, () => {
    console.log('http://localhost:3000/')
})