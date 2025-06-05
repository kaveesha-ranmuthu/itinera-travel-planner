import * as admin from "firebase-admin";

const app = admin.apps.length === 0 ? admin.initializeApp() : admin.app();

export { admin, app };
