const {userModel} = require('./models/user.model')
const {createHash, isValidPassword} = require('../utils.js')

class UserManager {

    async getUser(email, password) {

        const user = await userModel.findOne({ email: email})

        if(user) {
            if(isValidPassword(password, user.password))
                return user
            return "Invalid Password"
        }
        else 
            return "User not found"
            
    }

    async addUser(first_name, last_name, email, age, password) {

        await userModel.create({ 
            first_name:first_name, 
            last_name:last_name, 
            age:age, 
            email: email, 
            password: createHash(password),
        })
        
    }

    async updateUserPassword(email, newPassword) {

        const user = await userModel.findOne({ email: email})

        if(user){
            if(isValidPassword(newPassword, user.password))
                return "Password repeated"
            else{
                const response = await userModel.updateOne({email: email}, {password: createHash(newPassword)})
                if(response)
                    return "Password update succesfully"
            }
            return "Something went wrong updating password"
        }
        return "User not found"
    }

}

const userManager = new UserManager()

module.exports = {
    userManager
}