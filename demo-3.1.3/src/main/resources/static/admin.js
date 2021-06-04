let allUsers;
let allRoles;
fetch('/rest/roles').then(
    res => {
        res.json().then(
            roles => {
                allRoles = roles;
            }
        )
    }
)

function isHaveUser(email, id) {
    let result = false;
    allUsers.forEach(u => {
        if (u.email == email) {
            if (u.id != id) {
                result = true;
                alert("Пользователь с таким email уже существует!!!");
            }
        }
    })
    return result;
}

fetch('/rest/users').then(
    res => {
        res.json().then(
            data => {
                allUsers = data;
                createTable(allUsers);
            }
        )
    }
)

function createTable(data) {
    let temp = "";
    data.forEach(u => {
        temp += "<tr id=\"" + u.id + "\">";
        temp += "<td>" + u.id + "</td>";
        temp += "<td>" + u.name + "</td>";
        temp += "<td>" + u.lastName + "</td>";
        temp += "<td>" + u.email + "</td>";
        temp += "<td>";
        let rolesStr = "";
        u.roles.forEach(r => {
            rolesStr += r.name + " ";
        })
        temp += rolesStr + "</td>";
        temp += "<td><button class=\"btn btn-info\" onclick=\"fEdit(this)\" id=\"editBtn" + u.id + "\">Edit</button></td>";
        temp += "<td><button class=\"btn btn-danger\" onclick=\"fDel(this)\" id=\"deleteBtn" + u.id + "\">Delete</button></td>" + "</tr>";
    })
    document.getElementById("usersTableBody").innerHTML = temp;
}

$('#addUserBtn').click(function () {
    let newUser = {
        name: "",
        lastName: "",
        email: "",
        password: "",
        roles: []
    };
    newUser.email = document.getElementById("emailNew").value;
    if (!isHaveUser(newUser.email, 0)) {
        newUser.name = document.getElementById("firstNameNew").value;
        newUser.lastName = document.getElementById("lastNameNew").value;
        newUser.password = document.getElementById("passwordNew").value;
        newUser.roles = [];
        [].slice.call(document.getElementById("rolesNew")).forEach(op => {
            if (op.selected) {
                allRoles.forEach(r => {
                    if (r.name == op.text) {
                        newUser.roles.push(r);
                    }
                })
            }
        })
        fetch('/rest/users', {
            method: 'POST',
            Accept: 'application/json, */*; q=0.01',
            body: JSON.stringify(newUser),
            headers: {'Content-Type': 'application/json'}
        }).then(res1 => {
            if (res1.ok) {
                res1.json().then(u => {
                    allUsers.push(u);
                    createTable(allUsers);
                })
                document.getElementById("firstNameNew").value = "";
                document.getElementById("lastNameNew").value = "";
                document.getElementById("emailNew").value = "";
                document.getElementById("passwordNew").value = "";
                document.getElementById("rolesNew").selectedIndex = -1;
            } else {
                alert("Не удалось добавить: " + res1.status);
            }
        })
    }
})

function getUserById(id) {
    let t = null;
    allUsers.forEach(u => {
        if (u.id == id) {
            t = u;
        }
    })
    return t;
}

$('#editUserBtn').click(function () {
    let edit = {
        id: -1,
        name: "",
        lastName: "",
        email: "",
        password: "",
        roles: []
    };
    edit.email = document.getElementById("emailEditModal").value;
    edit.id = document.getElementById("idEditModal").value;
    if (!isHaveUser(edit.email, edit.id)) {
        $('#editModal').modal('hide');
        edit.name = document.getElementById("firstNameEditModal").value;
        edit.lastName = document.getElementById("lastNameEditModal").value;
        edit.password = document.getElementById("passwordEditModal").value;
        edit.roles = [];
        [].slice.call(document.getElementById("rolesEditModal")).forEach(op => {
            if (op.selected) {
                allRoles.forEach(r => {
                    if (r.name == op.text) {
                        edit.roles.push(r);
                    }
                })
            }
        })
        fetch('/rest/users', {
            method: 'PUT',
            body: JSON.stringify(edit),
            headers: {'Content-Type': 'application/json'}
        })
            .then(res => {
                if (res.ok) {
                    allUsers.forEach(u => {
                        if (u.id == edit.id) {
                            u.name = edit.name;
                            u.lastName = edit.lastName;
                            u.email = edit.email;
                            if (edit.password !== "") {
                                u.password = edit.password;
                            }
                            u.roles = edit.roles;
                        }
                    })
                    createTable(allUsers);
                }
            });
    }
})

$('#delUserBtn').click(function () {
    let id = document.getElementById("idDelModal").value;
    $('#deleteModal').modal('hide');

    fetch('/rest/users/' + id, {method: 'DELETE'})
        .then(res => {
            if (res.ok) {
                document.getElementById(id).remove();
                let u = getUserById(id);
                let i = allUsers.indexOf(u);
                delete allUsers[i];
            } else {
                alert("Удаление не удалось: " + res.status);
            }
        });
})

function fEdit(el) {
    let idStr = el.id;
    let id = idStr.slice(7);
    allUsers.forEach(u => {
        if (u.id == id) {
            // user1 = u;
            console.log(u);
            document.getElementById("idEditModal").value = u.id;
            document.getElementById("firstNameEditModal").value = u.name;
            document.getElementById("lastNameEditModal").value = u.lastName;
            document.getElementById("emailEditModal").value = u.email;
            document.getElementById("rolesEditModal").size = allRoles.length;
            let temp = "";
            allRoles.forEach(r => {
                let select = "";
                u.roles.forEach(rUser => {
                    if (rUser.id == r.id) {
                        select = " selected";
                    }
                })
                temp += "<option" + select + ">" + r.name + "</option>";
            })
            document.getElementById("rolesEditModal").innerHTML = temp;
        }
    });
    $('#editModal').modal('show');
}

function fDel(el) {
    let idStr = el.id;
    let id = idStr.slice(9);
    allUsers.forEach(u => {
        if (u.id == id) {
            document.getElementById("idDelModal").value = u.id;
            document.getElementById("firstNameDelModal").value = u.name;
            document.getElementById("lastNameDelModal").value = u.lastName;
            document.getElementById("emailDelModal").value = u.email;
            document.getElementById("rolesDelModal").size = u.roles.length.toString();
            let temp = "";
            u.roles.forEach(r => {
                temp += "<option>" + r.name + "</option>";
            })
            document.getElementById("rolesDelModal").innerHTML = temp;
        }
    });
    $('#deleteModal').modal('show');
}