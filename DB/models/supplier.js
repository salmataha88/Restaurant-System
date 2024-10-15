import {model , Schema } from 'mongoose';
const supplierModel = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    contactInfo: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }
},{
    timestamps: true
});

export default model('Supplier', supplierModel);
