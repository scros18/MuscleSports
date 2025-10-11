import { Database } from '../lib/database';

async function makeAdmin() {
  try {
    const email = 'admin@ordifydirect.com';
    console.log(`Making ${email} an admin...`);

    const user = await Database.findUserByEmail(email);
    if (!user) {
      console.error(`User ${email} not found`);
      return;
    }

    await Database.updateUserRole(user.id, 'admin');

    console.log(`✓ Successfully made ${email} an admin!`);
  } catch (error) {
    console.error('Error making admin:', error);
  } finally {
    process.exit(0);
  }
}

makeAdmin();