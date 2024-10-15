import { Schema, model } from 'mongoose';
var productModel = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    inStock:{
        type:Boolean,
        required:true,
    },
    category:{
        type : Schema.Types.ObjectId,
        ref:'Category',
    }
},
{timestamps:true});

export default productModel= model('Product', productModel);