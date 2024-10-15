import { model , Schema } from 'mongoose';
var reportModel = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportType: {
        type: String,
        enum: ['Sales Report', 'Inventory Report'],
        required: true
    },
    reportDetails: {
        type: String,
        required: true
    },
    reportStatus: {
        type: String,
        enum: ['Pending', 'Resolved'],
        default: 'Pending'
    },
}, {
    timestamps: true
});

export default reportModel = model('Report', reportModel);