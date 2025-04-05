import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json())

const ACCOUNT_FILE_PATH = './accounts.json'
const NUTRITIONIST_FILE_PATH = './nutritionistRequests.json'

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/admin', (req, res) => {
    res.render('admin.ejs')
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
        const fileData = fs.readFileSync(ACCOUNT_FILE_PATH, 'utf8')
        data = JSON.parse(fileData)
    }catch(error){
        console.log(error)
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

app.get("/accounts", (req, res) => {
    fs.readFile(ACCOUNT_FILE_PATH, "utf8", (err,data) => {
        res.json(JSON.parse(data));
    });
});

app.put("/updateAccount", (req, res) => {
    const {id, username, password, email} = req.body;
    fs.readFile(ACCOUNT_FILE_PATH, "utf8", (err,data) => {
        const accounts = JSON.parse(data);
        const acc = accounts.find(acc => acc.id == id);

        acc.username = username || acc.username
        acc.password = password || acc.password;
        acc.email = email || acc.email;

        fs.writeFile(ACCOUNT_FILE_PATH, JSON.stringify(accounts,null,2), () => {
            res.json({account: acc})
        })
    })
})

app.delete("/deleteAccount", (req, res) => {
    const {ids} = req.body;

    fs.readFile(ACCOUNT_FILE_PATH, "utf8", (err,data) => {
        const accounts = JSON.parse(data).filter(acc => !ids.includes(`${acc.id}`)) 

        fs.writeFile(ACCOUNT_FILE_PATH, JSON.stringify(accounts,null,2), () => {
            res.json({deleteIds: ids})
        })
    })    
})

app.get(`/nutritionistRequests`, (req, res) => {
    fs.readFile(ACCOUNT_FILE_PATH, 'utf8', (err,data) =>{
        const accounts = JSON.parse(data).filter(acc => acc.interviewDate !== undefined && acc.role == 'normalcustomer')

    fs.writeFile(NUTRITIONIST_FILE_PATH, JSON.stringify(accounts,null,2), () => {
        fs.readFile(NUTRITIONIST_FILE_PATH,'utf8',(err,data) => {
            res.json(JSON.parse(data))
        })
    })
    })
    
})

app.post(`/approveNutritionistRequest`,(req, res) => {
    const {id} = req.body
    fs.readFile(NUTRITIONIST_FILE_PATH, 'utf8', (err,data) => {
        const requests = JSON.parse(data).filter(req => req.id != id)
        fs.writeFile(NUTRITIONIST_FILE_PATH, JSON.stringify(requests,null,2), () => {})    
    })
    
    fs.readFile(ACCOUNT_FILE_PATH,'utf8', (err, data) => {
        const accounts = JSON.parse(data)
        const user = accounts.find(acc => acc.id == id)
        
        if (user) {
            user.role = 'nutritionist'
            delete user.interviewDate
        }

        fs.writeFile(ACCOUNT_FILE_PATH, JSON.stringify(accounts,null,2), () => {
            res.json({approvedId: id})
        })
    })
})

app.post(`/rejectNutritionistRequest`,(req,res) => {
    const {id} = req.body
    fs.readFile(NUTRITIONIST_FILE_PATH, 'utf8', (err,data) => {
        const requests = JSON.parse(data).filter(req => req.id != id)
        fs.writeFile(NUTRITIONIST_FILE_PATH, JSON.stringify(requests,null,2), () => {
            res.json({rejectedId: id})
        })
    })
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