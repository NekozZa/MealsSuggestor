const container = document.querySelector('.container');
const resBtn = document.querySelector('.btn-res');
const logBtn = document.querySelector('.btn-log');


resBtn.addEventListener('click', () => {
    container.classList.add('active');
});

logBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

function hideDatePicker(){
    const dateInterview = document.querySelector('.dateInterview')
    const selected = document.querySelector('input[name="role"]:checked')
    if(selected.value === "nutritionist"){
        dateInterview.style.visibility = "visible"
    }else{
        dateInterview.style.visibility = "hidden"
    }
}

const loginForm = document.querySelector('.login form')
const nameLogin = document.querySelector('#username-log')
const passLogin = document.querySelector('#password-log')
const errorLogin = document.querySelector('#alert-login')
const loginBtn = document.querySelector('.login form button')


loginForm.onsubmit = (e) => {
    e.preventDefault()
}

loginBtn.onclick = async (e) => {

    const response = await fetch('/login', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: nameLogin.value, password: passLogin.value})
    })

    const data = await response.json()

    if (data['errorMess']) {
        errorLogin.style.display = "block"
    } else {
        errorLogin.style.display = "none"
        sessionStorage.setItem('apiKey', data.apiKey)
        
        if (data.isAdmin) {
            window.location.href = '/admin'
        } else {
            window.location.href = '/'
        }
    }
}



const registerForm = document.querySelector('.login form')
const nameRegister = document.querySelector('#username-reg')
const passRegister = document.querySelector('#password-reg')
const emailRegister = document.querySelector('#email')
const errorRegister = document.querySelector('#alert-reg')
const registerBtn = document.querySelector('.register form button')
const dateInterviewInput = document.querySelector('#date')

registerForm.onsubmit = (e) => {
    e.preventDefault()
}

passRegister.onkeydown = async (e) =>{
    if(passRegister.value.length < 8){
        errorRegister.innerHTML = "The password at least 8 characters!"
        errorRegister.style.display = "block"
    }else{
        errorRegister.style.display = "none"
    }
}

let selected

registerBtn.onclick = async (e) => {
    selected = document.querySelector('input[name="role"]:checked')

    let response

    if(selected.value === "nutritionist"){
        response = await fetch('/register', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: nameRegister.value, email: emailRegister.value, password: passRegister.value, role: selected.value, interviewDate: dateInterviewInput.value})
        })

        console.log(response)
    }else{
        response = await fetch('/register', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: nameRegister.value, email: emailRegister.value, password: passRegister.value, role: selected.value})
        })
    }
    
    const data = await response.json()
    
    if(data.errorMess){
        container.classList.add('active');
        errorRegister.innerHTML = "The username is exits!"
        errorRegister.style.display = "block"
    
    } else {
        container.classList.remove('active');
        errorRegister.style.display = "none"
        sessionStorage.setItem('apiKey', data.apiKey)
        window.location.href = '/'
    }
}