require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function main() {
    const [username, email, password] = process.argv.slice(2);
    if (!username || !email || !password) {
        console.error('Usage: node scripts/create-teacher.js <username> <email> <password>');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
        { email },
        { username, email, password: hashedPassword, role: 'teacher' },
        { upsert: true, new: true }
    );

    console.log('Teacher account ready:', { email: user.email, role: user.role });
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
