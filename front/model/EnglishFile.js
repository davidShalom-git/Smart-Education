import mongoose from 'mongoose';

const EnglishFileSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    url: {
        type: String,
        required: true
    },
}, { timestamps: true });

const EnglishFile = mongoose.models.EnglishFile || mongoose.model('EnglishFile', EnglishFileSchema);

export default EnglishFile;
