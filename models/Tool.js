const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    condition: { 
        type: String, 
        required: true 
    },
    images: [{
        type: String // We will store the Cloudinary URLs here
    }],
    isAvailable: { 
        type: Boolean, 
        default: true // Tools are available by default when first uploaded
    },
    // 🛑 The Magic Link: This connects the tool directly to the specific user who uploaded it!
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    neighborhood: { 
        type: String, 
        default: 'Kahawa West' // Automatically sets it to your local area
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Tool', toolSchema);