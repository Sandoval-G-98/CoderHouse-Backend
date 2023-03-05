const { response } = require('express');
const express = require('express');
const {userManager} = require('../dao/UserManager')
const sessionsRouter = express.Router()
const passport = require('passport');

sessionsRouter.post('/login', passport.authenticate("login", {failureRedirect: "faillogin"}), async (req, res) => { 

    if(!req.user)
        return res.status(400).send({status: "Error", error: "Invalid Credentials"})

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.email === "adminCoder@coder.com" && req.user.email === "adminCod3r123" ? "admin":"user"
    }
    
    res.status(200).send({msg: "Success"})

/*     const {email, password} = req.body
    let response

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.user = {first_name: "Coder", last_name: "House", age: "1", email: "adminCoder@coder.com", role: "admin"}
        response = "Success"
    } else {
        
        response = await userManager.getUser(email, password)

        if(response == "User not found")        
            res.status(404)  
        else if(response == "Invalid Password")
            res.status(401)      
        else {
            const {first_name, last_name, age, email} = response
            const user = {first_name, last_name, age, email, role: "user"}
            req.session.user = user
            res.status(200)
            response = "Success"
        }
    } */
    
})

sessionsRouter.get('/faillogin', async (req, res) => { 
    console.log("Failed strategy login")
    res.status(500).send({msg: "Failed Login"})
})

sessionsRouter.post('/register', passport.authenticate("register", {failureReddirect: "failRegister"}), async (req, res) => { 

/*     const {first_name, last_name, age, email, password} = req.body

    await userManager.addUser(first_name, last_name, email, age, password) */

    res.status(201).send({msg: "Success"})
})

sessionsRouter.get('/failRegister', async (req, res) => { 
    console.log("Failed strategy register")
    res.status(500).send({msg: "Failed Register"})
})

sessionsRouter.post('/logout', async (req, res) => {

    req.session.destroy(err => {
        if(err) res.send({status:'error', message:'Error al cerrar la sesión: '+err});
    })

    res.status(200).send({msg:"Success"})
})


sessionsRouter.post('/restore', async (req, res) => {

    const {email, newPassword} = req.body

    response = await userManager.updateUserPassword(email, newPassword)

    if(response == "Password update succesfully") {
        res.status(200)
        response = "Success"
    }
    else if (response == "User not found")
        res.status(404)
    else if(response == "Password repeated")
        res.status(400)
    else
        res.status(500)
    
    res.send({msg:response})
})

sessionsRouter.get("/github", passport.authenticate("github", {scope:["user:email"]}), async(req, res) => {})


sessionsRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async(req, res) => {


    if (req.user.email === "adminCoder@coder.com" && req.user.password === "adminCod3r123") {
        console.log("Entre al if de admin")
        req.session.user = {first_name: "Coder", last_name: "House", age: "1", email: "adminCoder@coder.com", role: "Admin"}
    } else {
        console.log("Entre al if de user")
        req.session.user = {first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, email: req.user.email, role: "User"}
        console.log(req.session.user)
    }
    console.log(req.session.user)
    res.redirect("/products")
})

module.exports = {
    sessionsRouter,
}