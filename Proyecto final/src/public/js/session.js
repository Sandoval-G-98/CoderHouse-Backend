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
        console.log(data);
        if(data.msg === "Success") {
            window.location.href = `http://localhost:8080/products/`;
        } else {
            alert("Usuario no encontrado")
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
                window.location.href = "http://localhost:8080/sessions/login"
            } else {
                Swal.fire({
                    title: "Error en inicio de sesión",
                    text: "Error en usuario o contraseña. Si no se encuentra registrado, por favor registrese.",
                    confirmButton: "Cool",
                    allowOutsideClick: false,
                }).then((result)=>{
                    if(result.value){
                        user = result.value
                    }
                })
            }
        })
        .catch(err => console.log(err)) 

    }
})