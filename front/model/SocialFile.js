import mongoose from 'mongoose'

const SocialFileSchema = new mongoose.Schema({
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
},{timestamps: true})

const SocialFile = mongoose.model.SocialFile || mongoose.model('SocialFile',SocialFileSchema)

export default SocialFile;