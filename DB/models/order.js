import { Schema, model , mongoose} from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose.connection);

var orderModel = new Schema({
    orderId:Number,
    items:[{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    }],
    table:{
        type:Number,
        ref:'Table',
        required:true,
    },
    status:{
        type:String,
        enum:['pending','preparing' , 'ready' , 'delivered' , 'paid' ],
        default:'pending',
    },
    totalAmount:{
        type:Number,
        required:true,
    },
    paymentMethod:{
        type : String,
        enum : ['Cash' , 'Visa'],
        default : 'Cash',
    }
},
{timestamps:true});

orderModel.plugin(AutoIncrement, {inc_field: 'orderId' , start_seq : 1});

export default orderModel = model('Order', orderModel);