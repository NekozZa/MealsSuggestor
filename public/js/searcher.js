const btn = document.querySelector('.find-btn')
const input = document.querySelector('input')
const modalBody = document.querySelector('.modal-body')

btn.onclick = async (e) => {
    e.preventDefault()
    const res = await fetch('/meals', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ingredients: input.value, number: 8})
    })

    const data = await res.json()
    const row = document.querySelector('.meals-row')
    row.innerHTML = ''  

    data['meals'].forEach((meal) => {
        const card = createCard(meal['id'], meal['title'], meal['image'])
        row.appendChild(card)
    })
} 

function createCard(id, title, imgSrc) {
    const holder = document.createElement('div')
    holder.classList = 'w-auto col-md-3 mb-5'
    holder.innerHTML = `<div class="${id} card shadow" onclick="getIngredients(${id})" data-bs-toggle="modal" data-bs-target="#exampleModal" style="width: 18rem; height: 20rem;">
                            <img class="card-img-top" src=${imgSrc}>
                            <div class="card-body">
                                <h5 class="text-center text-weight-normal">${title}</h5>
                            </div>
                        </div>`

    return holder
}

async function getIngredients(mealID) {
    modalBody.innerHTML = ''

    const id = mealID
    const res = await fetch(`/meals/${id}`, {method: 'GET'})
    const data = await res.json()
    
    data['extendedIngredients'].forEach((ingredient) => {
        const txt = document.createElement('p')
        txt.innerHTML = ingredient['original']
        modalBody.appendChild(txt)
    })
}