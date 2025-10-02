import mongoose from 'mongoose'

const TamilVideoSchema = new mongoose.Schema({
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

const TamilVideo = mongoose.model.TamilVideo || mongoose.model('TamilVideo', TamilVideoSchema)

export default TamilVideo;