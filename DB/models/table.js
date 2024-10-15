
import { Schema, model , mongoose } from 'mongoose'; 
import AutoIncrementFactory from 'mongoose-sequence';


const AutoIncrement = AutoIncrementFactory(mongoose.connection);


var tableModel = new Schema({
    _id:Number,
    capacity:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:['available','occupied','reserved'],
        default:'available',
    },
},{_id:false},
{timestamps:true});

tableModel.plugin(AutoIncrement ,{inc_field:'_id' , start_seq:1});

export default tableModel = model('Table', tableModel);