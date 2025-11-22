require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user'); // ensure correct filename (lowercase)

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.log("Usage: node fetchUser.js <email>");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const user = await User.findOne({ email });

    if (!user) {
      console.log("NO USER FOUND");
    } else {
      console.log("FOUND USER:");
      console.log(user);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("ERROR:", err);
  }
}

main();
