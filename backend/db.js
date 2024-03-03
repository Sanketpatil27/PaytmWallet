const mongoose = require('mongoose');

try {
    mongoose.connect("mongodb+srv://admin:KUOMZ3v7gfyPGlVA@cluster0.dikomqc.mongodb.net/paytm");
} catch (error) {
    console.log('Error connecting to database!!!');
}

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        // minLength: 6
    }
});

const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,       // Reference to user model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})



const User = mongoose.model('users', userSchema);
const Account = mongoose.model('Account', accountSchema)

module.exports = {
    User, 
    Account
};