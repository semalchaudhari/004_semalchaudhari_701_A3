import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    grant: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no'
    }

});

export default mongoose.model('Leave', leaveSchema);