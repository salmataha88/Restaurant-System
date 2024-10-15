import { Schema, model } from 'mongoose'; 

var categoryModel = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    description:{
        type:String,
        required:true,
    },
},
{timestamps:true});

export default categoryModel = model('Category', categoryModel);