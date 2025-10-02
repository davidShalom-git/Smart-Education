import mongoose from 'mongoose'

const SocialVideoSchema = new mongoose.Schema({
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

const SocialVideo = mongoose.model.SocialVideo || mongoose.model('SocialVideo', SocialVideoSchema)

export default SocialVideo;