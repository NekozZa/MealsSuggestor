import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'

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


app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login',(req, res) =>{
    const user = req.body['username']
    const passwordInput = req.body['password']
    let data = {}
    try{
        const fileData = fs.readFileSync('accounts.json', 'utf8')
        data = JSON.parse(fileData)
    }catch(error){
        console.log("File is not exits")
    }
    
    if(!data.some(account => account.username === user)){
        return res.json({errorMess: true});
    }
    const account = data.find(account => account.username === user);
    
    if(account.password !== passwordInput){
        return res.json({errorMess: true});
    }
    if(account.role === "admin"){
        return res.json({isAdmin: true});
    }
    const randomChar = account.apiKey
    res.json({apiKey: randomChar})
})

app.post('/register', (req, res) => {
    const user = req.body['username']
    const email = req.body['email']
    const passwordInput = req.body['password']
    const roleSelected = req.body['role']

    console.log(req.body)

    let randomChar = randomString(10)
    let data = []
    try{
        const fileData = fs.readFileSync('accounts.json', 'utf8')
        data = JSON.parse(fileData)
    }catch(error){
        console.log("File is not exits")
    }

    if(user == null || email == null || passwordInput == null){
        return res.json({errorMess: true});
    }

    if(data.some(account => account.username === user)){
        return res.json({errorMess: true});
    }

    if(passwordInput.length < 8){
        return res.json({errorMess: true});
    }

    let id = data.length + 1

    while(true){
        if(data.find(account => account.id == id)){
            id = id + 1
        }else{
            break
        }
    }
    
    if(roleSelected === "nutritionist"){
        const interviewDate = req.body['interviewDate']
        data.push({id:id, username:user, password: passwordInput, email: email, role: "normalcustomer", interviewDate: interviewDate}) 
    }else{
        data.push({id:id, username:user, password: passwordInput, email: email, role: roleSelected})
    }
    
    fs.writeFileSync('accounts.json', JSON.stringify(data, null, 2), 'utf8')

    res.json({apiKey: randomChar})
})

app.listen(PORT, () => {
    console.log('http://localhost:3000/')
})

function randomString(length){
    const char = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let res = ''
    for(let i = 0; i < length; i++){
        res += char.charAt(Math.floor(Math.random() * char.length))
    }
    return res
}