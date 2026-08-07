require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    title: String,
    author: mongoose.Schema.Types.ObjectId,
    url: String,
}, { timestamps: true });

const MODELS = {
    English: mongoose.model('EnglishFile', FileSchema),
    Social: mongoose.model('SocialFile', FileSchema),
    Tamil: mongoose.model('TamilFile', FileSchema),
};

const UserSchema = new mongoose.Schema({ email: String });
const User = mongoose.model('User', UserSchema);

function titleFromFilename(filename) {
    return path.basename(filename, path.extname(filename))
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);

    const author = await User.findOne({ email: 'teacher@champion.dev' });
    if (!author) {
        console.error('Teacher account not found — run scripts/create-teacher.js first');
        process.exit(1);
    }

    const assetsDir = path.join(__dirname, '..', 'public', 'assets');

    for (const subject of Object.keys(MODELS)) {
        const dir = path.join(assetsDir, subject);
        if (!fs.existsSync(dir)) continue;

        const Model = MODELS[subject];
        const files = fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isFile());

        for (const filename of files) {
            const url = `/assets/${subject}/${encodeURIComponent(filename)}`;
            const title = titleFromFilename(filename);

            const existing = await Model.findOne({ url });
            if (existing) {
                console.log(`Skip (exists): ${subject}/${filename}`);
                continue;
            }

            await Model.create({ title, url, author: author._id });
            console.log(`Added: ${subject} -> ${title}`);
        }
    }

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
