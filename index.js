import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import cors from 'cors'

const app = express()
const PORT = 3000

const ACCOUNT_FILE_PATH = './public/data/accounts.json'

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
    res.json({meals: data})
})

app.get('/meals/:id', async (req, res) => {
    const params = new URLSearchParams({apiKey: process.env.API_KEY})
    const response = await fetch(`https://api.spoonacular.com/recipes/${req.params.id}/information?${params}`, {method: 'GET'})
    const data = await response.json()
    res.json(data)
})

app.get('/profile', (req, res) => {
    res.render('profile.ejs')
})

app.get("/accounts", (req,res) => {
    fs.readFile(ACCOUNT_FILE_PATH, "utf8", (err,data) => {
        res.json(JSON.parse(data));
    });
});

app.put("/updateAccount", (req,res) => {
    const {id, username, password, email} = req.body;
    fs.readFile(ACCOUNT_FILE_PATH, "utf8", (err,data) => {
        const accounts = JSON.parse(data);
        const acc = accounts.find(acc => acc.id == id);

        acc.username = username || acc.username
        acc.password = password || acc.password;
        acc.email = email || acc.email;

        fs.writeFile(ACCOUNT_FILE_PATH, JSON.stringify(accounts,null,2), () => {
            console.log("Successfully")
        });
    });
});

app.delete("/deleteAccount", (req,res) => {
    const {ids} = req.body;
    fs.readFile(ACCOUNT_FILE_PATH, "utf8", (err,data) => {
        const accounts = JSON.parse(data).filter((acc) => {
            return !ids.some((id) => acc.id == id);
        });

        fs.writeFile(ACCOUNT_FILE_PATH, JSON.stringify(accounts,null,2), () => {
            console.log("Successfully")
        });
    });    
});

app.listen(PORT, () => {
    console.log('http://localhost:3000/')
})