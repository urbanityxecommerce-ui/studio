import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import serviceAccount from '../../../serviceAccount.json';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Set the environment variable for Google Application Credentials
  // This is for local development and will be overridden in a cloud environment
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // In a real app, you'd want to handle this more securely,
    // but for the studio environment, this is acceptable.
    // The serviceAccount.json is a placeholder managed by the environment.
    process.env.GOOGLE_APPLICATION_CREDENTIALS = 'serviceAccount.json';
  }

  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  return app;
}
