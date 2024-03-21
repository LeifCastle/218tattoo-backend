const bcrypt = require('bcrypt');

const passwordToHash = "Bailey"; // Replace with your actual admin password

bcrypt.hash(passwordToHash, 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log("Hashed password:", hash);
});