function getAccounts(){
    fetch(`/accounts`)
    .then(res => res.json())
    .then(accounts => {
        let table = document.getElementById("accountTable");
        table.innerHTML = "";
        accounts.forEach(acc => {
            let row = `
                <tr>
                    <td><input type="checkbox" class="accountCheckbox" value="${acc.id}"></td>
                    <td>${acc.username}</td>
                    <td>${acc.email}</td>    
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="openUpdateModal('${acc.id}', '${acc.username}', '${acc.email}')" data-bs-toggle="modal" data-bs-target="#updateModal">Update</button>
                    </td>
                </tr>    
            `;
            table.innerHTML += row;
        });
    });
}

function getNutritionistRequests(){
    fetch(`/nutritionistRequests`)
    .then(res => res.json())
    .then(requests => {
        let table = document.getElementById("nutritionistTable");
        table.innerHTML = "";
        requests.forEach(req => {
            let row = `
                <tr>
                    <td>${acc.name}</td>
                    <td>${acc.email}</td>    
                </tr>    
            `;
            table.innerHTML += row;
        });
    });
}

function openUpdateModal(id, username, email){
    const idField = document.getElementById("updateID")
    const usernameField = document.getElementById("updateUsername")
    const emailField = document.getElementById("updateEmail") 
    
    idField.value = id
    usernameField.value = username
    emailField.value = email    
}

function updateAccount(){
    const id = document.getElementById("updateID")
    const username = document.getElementById("updateUsername")
    const email = document.getElementById("updateEmail")
    const password = document.getElementById("updatePassword")

    fetch(`/updateAccount`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: id.value, username: username.value, email: email.value, password: password.value})
    })
}

function deleteSelected(){
    let checkboxes = document.querySelectorAll(".accountCheckbox:checked");
    if(checkboxes.length === 0){
        alert("Select one account to delete");
        return;
    }

    let ids = []

    checkboxes.forEach(cb => {ids.push(cb.value)});

    fetch(`/deleteAccount`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ids: ids})
    })

    getAccounts( )
}

function toggleSelectAll(){
    let checkboxes = document.querySelectorAll(".accountCheckbox");
    let selectAll = document.getElementById("selectAll").checked;
    checkboxes.forEach(cb => cb.checked = selectAll);
}