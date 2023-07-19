const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
    access_token:{
        type:String,
        required:true
    },
    refresh_token:{
        type:String,
        required:true
    },
},{
timestamps:true
})

const Auth = mongoose.model('Auth', AuthSchema);

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
        },
        auth_details: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth'
        }]
}, {
    timestamps:true
})


// Pre middleware to hash the password before saving the user
userSchema.pre('save', function (next) {
    const user = this;
    
    // Check if the password is modified or it's a new user
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.hash(user.password, Number(process.env.BCRYPT_ITERATIONS_COST), (err, hashedPassword) => {
        user.password = hashedPassword;
        next();
    });
});


const Users = mongoose.model('Users', userSchema);
module.exports = Users;