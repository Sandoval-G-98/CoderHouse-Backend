const express = require('express');
const {userManager} = require('../dao/UserManager')
const sessionsRouter = express.Router()

sessionsRouter.post('/login', async (req, res) => { 

    const {email, password} = req.body
    let response

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.user = {first_name: "Coder", last_name: "House", age: "1", email: "adminCoder@coder.com", role: "admin"}
        response = "Success"
    } else {
        
        response = await userManager.getUser(email, password)
    
        if(response == "User not found") 
            res.status(404)        
        else {
            const {first_name, last_name, age, email} = response[0]
            const user = {first_name, last_name, age, email, role: "user"}
            req.session.user = user
            res.status(200)
            response = "Success"
        }
    }
    
    res.send({msg: response})
})

sessionsRouter.post('/register', async (req, res) => { 

    const {first_name, last_name, age, email, password} = req.body

    await userManager.addUser(first_name, last_name, email, age, password)

    res.status(201).send({msg: "Success"})
})

sessionsRouter.post('/logout', async (req, res) => {

    console.log("Entre al destroy")
    req.session.destroy(err => {
        if(err) res.send({status:'error', message:'Error al cerrar la sesión: '+err});
    })

    res.status(200).send({msg:"Success"})
})

module.exports = {
    sessionsRouter,
}