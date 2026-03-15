const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    neighborhood: { 
        type: String, 
        default: 'Kahawa West' 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);