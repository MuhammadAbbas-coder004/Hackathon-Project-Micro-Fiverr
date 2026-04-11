const bcrypt = require('bcryptjs');
async function test() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    console.log('Hash:', hash);
    const isMatch = await bcrypt.compare('password123', hash);
    console.log('Is match:', isMatch);
  } catch (e) {
    console.error('Bcrypt error:', e);
  }
}
test();
