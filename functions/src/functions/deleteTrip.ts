import { onCall } from "firebase-functions/v2/https";
import { admin } from "../utils/admin";

export const deleteTrip = onCall<{ tripId: string }>(async (request) => {
  const uid = request.auth?.uid;
  const tripId = request.data.tripId;

  if (!uid) {
    throw new Error("User not authenticated.");
  }

  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  const tripRef = admin.firestore().doc(`users/${uid}/trips/${tripId}`);

  try {
    await admin.firestore().recursiveDelete(tripRef);
    return { success: true };
  } catch (err) {
    console.error("Error deleting trip:", err);
    throw new Error("Failed to delete trip.");
  }
});
