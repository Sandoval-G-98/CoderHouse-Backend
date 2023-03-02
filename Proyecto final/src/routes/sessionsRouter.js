const express = require('express');
const {userManager} = require('../dao/UserManager')
const sessionsRouter = express.Router()

sessionsRouter.post('/login', async (req, res) => { 

    const {email, password} = req.body

    const response = await userManager.getUser(email, password)

    res.status(200).send({msg: "Success"})
})

sessionsRouter.post('/register', async (req, res) => { 

    const {firs_name, last_name, age, email, password} = req.body

    await userManager.addUser(firs_name, last_name, email, age, password)

    res.status(201).send({msg: "Success"})
})

sessionsRouter.post('/sessions/logout', async (req, res) => {
    req.session.destroy(err => {
        if(err) res.send({status:'error', message:'Error al cerrar la sesión: '+err});

        res.redirect('/sessions/login');
    })
})



module.exports = {
    sessionsRouter,
}