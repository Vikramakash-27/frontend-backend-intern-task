const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Safe model export — prevents OverwriteModelError when nodemon reloads
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
