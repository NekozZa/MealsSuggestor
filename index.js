import express from 'express'

const app = express()
const PORT = 3000

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.listen(PORT, () => {
    console.log('http://localhost:3000/')
})