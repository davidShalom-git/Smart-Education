import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['QUIZ', 'CHART', 'EMAIL', 'SPEECH', 'LOGIN', 'COURSE_VIEW'],
        required: true
    },
    title: {
        type: String, // e.g., "Java Loops Quiz" or "Sales Flow Chart"
        required: true
    },
    description: String,
    metadata: {
        // Flexible field to store extra data provided by agents
        // e.g., for Quiz: { score: 80, questionCount: 10 }
        // e.g., for Chart: { imageUrl: "..." }
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    xpEarned: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

export default Activity;
