import { model , Schema } from 'mongoose';

const InventoryModel = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'liters', 'grams', 'boxes']
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    supplierId: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier'
    }
},
{
    timestamps: true
}
);

export default model('Inventory', InventoryModel);
