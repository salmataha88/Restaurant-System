import { Schema, model } from 'mongoose'; 

var userModel = new Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type : String,
        enum:['Staff','User', 'Admin'],
        default : 'User',
        required:true
    },
    token:{
        type:String,
    }
});

export default userModel = model('User', userModel);