import * as logger from "firebase-functions/logger";
import { onCall } from "firebase-functions/v2/https";
import { admin } from "../utils/admin";

export const deleteUser = onCall(async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new Error("User must be authenticated to delete their account.");
  }

  try {
    // Delete Firestore user data recursively
    const userDocRef = admin.firestore().doc(`users/${uid}`);
    await admin.firestore().recursiveDelete(userDocRef);

    await admin.auth().deleteUser(uid);

    logger.info(`Successfully deleted user and data for UID: ${uid}`);
    return { success: true };
  } catch (error) {
    logger.error("Error deleting user and data", error);
    throw new Error("Failed to delete account. Please try again later.");
  }
});
