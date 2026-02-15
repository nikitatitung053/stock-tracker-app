require('dotenv').config();
const mongoose = require('mongoose');

const deleteUser = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    const result = await db.collection('user').deleteOne({ email });
    
    if (result.deletedCount > 0) {
      console.log(`Deleted user: ${email}`);
    } else {
      console.log(` User not found: ${email}`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const email = process.argv[2] || 'hello123@gmail.com';
deleteUser(email);
