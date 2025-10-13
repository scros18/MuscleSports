import * as dotenv from 'dotenv';
import { Database } from '../lib/database';

dotenv.config({ path: '.env.local' });

async function setDefaultSettings() {
  try {
    console.log('Setting default business settings...');

    // Set Ordify as the default theme and ensure settings exist
    await Database.createOrUpdateBusinessSettings({
      id: 'default',
      theme: 'ordify',
      businessName: 'Ordify Direct Ltd',
      businessType: 'ecommerce',
    });

    console.log('✓ Default settings configured successfully!');
    console.log('  - Theme: Ordify');
    console.log('  - Business Name: Ordify Direct Ltd');
    console.log('  - Business Type: E-commerce');

    // Verify settings
    const settings = await Database.getBusinessSettings('default');
    console.log('\nCurrent settings:', {
      theme: settings?.theme,
      businessName: settings?.businessName,
      businessType: settings?.businessType
    });

  } catch (error) {
    console.error('Error setting default settings:', error);
  }
}

setDefaultSettings();

