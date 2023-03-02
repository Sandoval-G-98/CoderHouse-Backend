const {userModel} = require('./models/user.model')

class UserManager {

    async getUser(email, password) {

        const response = await userModel.find({ email: email, password:password, });

        if(response){
            return response
        }

        return "User not found"
    }

    async addUser(firstName, lastName, email, age, password) {

        await userModel.create({ 
            firstName:firstName, 
            lastName:lastName, 
            age:age, email: 
            email, password: 
            password
        })
        
    }

}

const userManager = new UserManager()

module.exports = {
    userManager
}