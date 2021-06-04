fetch('/rest/user').then(
    res => {
            res.json().then(
                data => {
                        let temp = "";
                        temp += "<tr id=\"" + data.id + "\">";
                        temp += "<td>" + data.id + "</td>";
                        temp += "<td>" + data.name + "</td>";
                        temp += "<td>" + data.lastName + "</td>";
                        temp += "<td>" + data.email + "</td>";
                        temp += "<td>";
                        let rolesStr = "";
                        data.roles.forEach(r => {
                                rolesStr += r.name + " ";
                        })
                        temp += rolesStr + "</td>" + "</tr>";
                        document.getElementById("tableUserBody").innerHTML = temp;
                }
            )
    }
)