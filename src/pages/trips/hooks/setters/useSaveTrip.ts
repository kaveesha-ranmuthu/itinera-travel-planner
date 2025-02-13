import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../../firebase-config";
import { Trip } from "../../TripsLandingPage";

export function useSaveTrip() {
  const saveTrip = async ({
    tripName,
    startDate,
    endDate,
    budget,
    countries,
    currency,
    numberOfPeople,
    imageData,
    subCollections,
  }: Trip) => {
    const user = auth.currentUser;
    if (!user) {
      return new Error("User not authenticated.");
    }

    try {
      await addDoc(collection(db, `users/${user.uid}/trips`), {
        tripName,
        startDate,
        endDate,
        budget,
        countries,
        currency,
        numberOfPeople,
        imageData: imageData || null,
        subCollections,
        createdAt: new Date(),
      });
    } catch {
      return new Error("Failed to save trip.");
    }
  };

  return { saveTrip };
}
