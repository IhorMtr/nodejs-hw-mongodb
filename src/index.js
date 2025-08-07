import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

async function startApp() {
  try {
    await initMongoConnection();
    setupServer();
  } catch (err) {
    console.error('Application failed to start:', err);
    process.exit(1);
  }
}

startApp();
