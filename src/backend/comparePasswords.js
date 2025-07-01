const bcrypt = require("bcrypt");

// Function to compare plaintext password with hashed password
const comparePasswords = async (plaintextPassword, hashedPassword) => {
  try {
    // Compare plaintext password with hashed password
    const match = await bcrypt.compare(plaintextPassword, hashedPassword);
    return match; // Returns true if passwords match, false otherwise
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error; // Throw error if comparison fails
  }
};

module.exports = comparePasswords;
