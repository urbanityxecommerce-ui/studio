import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import * as fs from 'fs';
import * as path from 'path';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Construct an absolute path to the service account file
  const serviceAccountPath = path.join(process.cwd(), 'serviceAccount.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Could not find serviceAccount.json at path: ${serviceAccountPath}. Ensure the file exists in the project root.`);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  return app;
}
