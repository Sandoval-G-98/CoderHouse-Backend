const elementExits = (id) => document.getElementById(id) !== null;

elementExits("login") && document.getElementById("login").addEventListener("click", (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/api/sessions/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.msg === "Success") {
            console.log("Entre")
            window.location.assign("http://localhost:8080/products");
        } else {
            alert("Error en login de usuario. Valide los campos")
        }
    })
    .catch(err => console.log(err))

})

elementExits("signup") && document.getElementById("signup").addEventListener("click", (e) => {
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const age = document.getElementById("age").value;
    
    if(!first_name || !last_name || !email || !password || !age) {
        alert("Todos los campos son obligatorios")
    } else {
        fetch("http://localhost:8080/api/sessions/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                password,
                age
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.msg === "Success") {
                window.location.assign("http://localhost:8080/login")
            } else {
                alert("Error en alta de usuario. Valide los campos")
            }
        })
        .catch(err => console.log(err)) 

    }
})

elementExits("logout") && document.getElementById("logout").addEventListener("click", (e) => {

    fetch("http://localhost:8080/api/sessions/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "logout": true,
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.msg === "Success") {
                window.location.assign("http://localhost:8080/login")
            } else {
                alert("Error en cierre de cesion")
            }
        })
        .catch(err => console.log(err))
})


elementExits("restore") && document.getElementById("restore").addEventListener("click", (e) => {
    window.location.assign("http://localhost:8080/restore")
})


elementExits("restore-password") && document.getElementById("restore-password").addEventListener("click", (e) => {
    
    const email = document.getElementById("email").value
    const newPassword = document.getElementById("new-password").value

    if(!email || !newPassword ) {
        alert("Los campos email y password son obligatorios")
    }
    else {
        fetch("http://localhost:8080/api/sessions/restore", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                newPassword
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.msg === "Success") {
                window.location.assign("http://localhost:8080/login")
            } else {
                alert("Error en cambio de contraseña. Valide que no esta usando la misma contraseña")
            }
        })
        .catch(err => console.log(err))
    }
})
