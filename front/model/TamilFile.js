import mongoose from 'mongoose'

const TamilFileSchema = new mongoose.Schema({
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

const TamilFile = mongoose.model.TamilFile || mongoose.model('TamilFile',TamilFileSchema)

export default TamilFile;