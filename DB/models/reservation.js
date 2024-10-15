import { Schema, model } from 'mongoose';

var reservationModel = new Schema({
    tableId: {
        type: Number,
        ref: 'Table',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reservationTime:{
        type: Date,
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed' , 'placed'],
        default: 'confirmed'
    },

}, {
    timestamps: true
});

export default reservationModel = model('Reservation', reservationModel);