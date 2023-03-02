const express = require('express');
const {userManager} = require('../dao/UserManager')
const sessionsRouter = express.Router()

sessionsRouter.post('/login', async (req, res) => { 

    const {email, password} = req.body

    const response = await userManager.getUser({ email: email, password: password})

    res.status(200).send({msg: "Success"})
})

sessionsRouter.post('/register', (req, res) => { 

})


module.exports = {
    sessionsRouter,
}