const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    toolName: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    condition: { 
        type: String, 
        default: 'Good' 
    },
    isAvailable: { 
        type: Boolean, 
        default: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    // The "Relationship" - This links the tool to the specific neighbor who listed it
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Tool', toolSchema);