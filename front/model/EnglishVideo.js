import mongoose from 'mongoose'

const EnglishVideoSchema = new mongoose.Schema({
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
}, { timestamps: true })

const EnglishVideo = mongoose.models.EnglishVideo || mongoose.model('EnglishVideo', EnglishVideoSchema)

export default EnglishVideo;