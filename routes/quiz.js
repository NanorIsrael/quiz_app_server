const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        first_name:{
            type:String,
            required:true
        },
        last_name:{
            type:String,
            required:true,
            
        }
})

const Users = mongoose.model('Users', userSchema);
module.exports = Users;