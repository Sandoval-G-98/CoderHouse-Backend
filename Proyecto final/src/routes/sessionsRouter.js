const { response } = require('express');
const express = require('express');
const {userManager} = require('../dao/UserManager')
const sessionsRouter = express.Router()
const passport = require('passport');

sessionsRouter.post('/login', passport.authenticate("login", {failureRedirect: "faillogin"}), async (req, res) => { 
    
    try {
        if(!req.user)
            return res.status(400).send({status: "Error", error: "Invalid Credentials"})

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.email === "adminCoder@coder.com" ? "admin":"user"
        }

    } catch(err) {
        console.log("Error " + err)
    }
        
    res.status(200).send({msg: "Success"})
    
})

sessionsRouter.get('/faillogin', async (req, res) => { 
    console.log("Failed strategy login")
    res.status(500).send({msg: "Failed Login"})
})

sessionsRouter.post('/register', passport.authenticate("register", {failureReddirect: "failRegister"}), async (req, res) => { 

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
        req.session.user = {first_name: "Coder", last_name: "House", age: "1", email: "adminCoder@coder.com", role: "Admin"}
    } else {
        req.session.user = {first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, email: req.user.email, role: "User"}
    }
    res.redirect("/products")
})

module.exports = {
    sessionsRouter,
}