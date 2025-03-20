import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/ingredients', (req, res) => {
    res.render('./partials/ingredients.ejs')
})

app.post('/meals', (req, res) => {
    axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
        params: {
            apiKey: process.env.API_KEY,
            ingredients: req.body.ingredients,
            number: 5
        }
    })
    .then((response) => {
        res.render('./partials/meals.ejs', {meals: response.data})
    })
    .catch((error) => {
        console.log(error)
    })
    
})

app.listen(PORT, () => {
    console.log('http://localhost:3000/')
})