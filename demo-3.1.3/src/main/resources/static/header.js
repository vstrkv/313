fetch('/rest/user').then(
    res => {
        res.json().then(
            data => {
                let temp = "";
                let rolesStr = "";
                data.roles.forEach(r => {
                    rolesStr += r.name + " ";
                })
                temp = data.email + " with roles " + rolesStr;
                document.getElementById("whoIsHere").innerHTML = temp;
            }
        )
    }
)