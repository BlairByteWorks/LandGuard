const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();


const User = require('./models/User');

const seedDatabase = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected Successfully!");

    await User.deleteOne({ email: "admin@landguard.com" });
    console.log("🧹 Cleared old admin account from the database.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("@AdminReg001", salt);

    const defaultRegistrar = new User({
        name: "Chief Registrar",
        email: "admin@landguard.com",
        password: hashedPassword,
        role: "Registrar"
    });

    await defaultRegistrar.save();
    console.log("✅ SUCCESS! Forced creation of a fresh Default Registrar:");
    console.log("   -> Email: admin@landguard.com");
    console.log("   -> Password: @AdminReg001");

    console.log("Database setup complete. Exiting...");
    process.exit();

  } catch (error) {
    console.error("ERROR SEEDING DATABASE:", error);
    process.exit(1);
  }
};

seedDatabase();