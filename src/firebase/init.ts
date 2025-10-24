
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import * as fs from 'fs';
import * as path from 'path';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // This function is kept for potential future use with firebase-admin,
  // but it is not actively called in the simplified session management logic.
  // The logic to read serviceAccount.json is therefore commented out to prevent
  // build or runtime errors if the file is not present.

  /*
  const serviceAccountPath = path.join(process.cwd(), 'serviceAccount.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Could not find serviceAccount.json at path: ${serviceAccountPath}. Ensure the file exists in the project root.`);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  return app;
  */

  // Return a placeholder or handle the absence of initialization as needed.
  // For now, we throw an error if it's called without being properly set up.
  throw new Error("initializeAdminApp is not configured to run in this environment.");
}

    