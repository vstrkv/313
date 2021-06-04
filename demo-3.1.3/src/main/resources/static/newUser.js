fetch('/rest/roles').then(
    res => {
        res.json().then(
            roles => {
                let temp = "";
                console.log(roles)
                document.getElementById("rolesNew").size = roles.length;
                roles.forEach(r => {
                    temp += "<option>" + r.name + "</option>";
                })
                document.getElementById("rolesNew").innerHTML = temp;
            }
        )
    }
)