const passport = require('passport')
const GitHubStrategy = require('passport-github2')
const local = require('passport-local')
const {userModel} = require('../dao/models/user.model')
const {createHash, isValidPassword} = require('../utils')

const localStrategy = local.Strategy

const initializePassport = () =>{

    passport.serializeUser((user, done) =>{
        done(null, user)
    })

    passport.deserializeUser( async (id, done) =>{
        let user = await userModel.findById(id)
        done(null, user)
    })

    passport.use("github", new GitHubStrategy(
        {
          clientID: process.env.REAC_APP_CLIENT_GITHUB_ID,
          clientSecret: process.env.REAC_APP_CLIENT_GITHUB_SECRET,
          callbackURL: process.env.REAC_APP_CLIENT_GITHUB_CALLBACK_URL
        }, async (accessToken, refreshToken, profile, done)=>{
            try{
                let user = await userModel.findOne({email: profile._json.email})
                if(!user){ 
                    const newUser = {
                        first_name: profile._json.name,
                        last_name:"",
                        email: profile._json.email,
                        age:1,
                        password: ""
                    }
                    let result = await userModel.create(newUser)
                    done(null, result)
                } else {
                    done(null, user)
                }
            } catch(e){
                return done("Error al obtener el usuario: " + e)
            }
        }
    ))

    
    passport.use("register", new localStrategy(
        {
          passReqToCallback: true,
          usernameField: "email"
        }, async (req, email, password, done)=>{
            try{
                const {first_name, last_name, email, age} = req.body
                let user = await userModel.findOne({ email: email})
                if(user){ 
                    console.log("User alreddy exists")
                    return done(null, false)
                } else {
                    const newUser = {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        age: age,
                        password: createHash(password)
                    }
                    let result = await userModel.create(newUser)
                    done(null, result)
                }
            } catch(e){
                return done("Error al obtener el usuario: " + e)
            }
        }
    ))

    passport.use("login", new localStrategy(
        {
          passReqToCallback: true,
          usernameField: "email"
        }, async (req, email, password, done)=>{
            try{
                if(email === "adminCoder@coder.com" && password === "adminCod3r123") {
                    console.log("Entre aca")
                    let user = {first_name: "Coder", last_name: "House", email: "adminCoder@coder.com", age: 1}
                    console.log(user)
                    return done(null, user)
                } else {
                    let user = await userModel.findOne({ email: email})
                    
                    if(!user){
                        console.log("User doesn't exist")
                        return done(null, false)
                    }

                    if(!isValidPassword(password, user.password))
                        return done(null, false)

                    return done(null, user)
                }
            } catch(e){
                return done("Error al obtener el usuario: " + e)
            }
        }
    ))
}

module.exports = {
    initializePassport,
}