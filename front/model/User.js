import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    // Gamification & Stats
    xp: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    level: {
        type: Number,
        default: 1
    },
    badges: [{
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now }
    }],
    stats: {
        quizzesGenerated: { type: Number, default: 0 },
        chartsGenerated: { type: Number, default: 0 },
        emailsSent: { type: Number, default: 0 },
        minutesRecorded: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;