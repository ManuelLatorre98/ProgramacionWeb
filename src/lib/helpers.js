const bcrypt= require("bcryptjs")
const helpers = {}

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);//this makes a string of characters, more characters more safe but more slow execution
    const encryptedPassword= await bcrypt.hash(password, salt);//This starts the encrypting of de password based on salt string
    return encryptedPassword;
}

helpers.matchPassword = async (password, savedPassword)=>{
    return await bcrypt.compare(password, savedPassword)
}
module.exports = helpers;