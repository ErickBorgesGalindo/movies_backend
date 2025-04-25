const pool = require("../db");
const bcrypt = require("bcrypt");

const hashPasswords = async () => {
  try {
    const users = await pool.query('SELECT id_user, user_pass FROM "User"');

    for (const user of users.rows) {
      const hashedPassword = await bcrypt.hash(user.user_pass, 10);
      await pool.query('UPDATE "User" SET user_pass = $1 WHERE id_user = $2', [
        hashedPassword,
        user.id_user,
      ]);
      console.log(`Password for user ${user.id_user} has been hashed.`);
    }

    console.log("All passwords have been hashed.");
    process.exit();
  } catch (error) {
    console.error("Error hashing passwords:", error);
    process.exit(1);
  }
};

hashPasswords();
s