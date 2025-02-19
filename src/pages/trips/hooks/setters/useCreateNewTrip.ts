import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../../firebase-config";
import { Trip } from "../../TripsLandingPage";

export function useCreateNewTrip() {
  const createNewTrip = async ({
    tripName,
    startDate,
    endDate,
    budget,
    countries,
    currency,
    numberOfPeople,
    imageData,
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
        subCollections: [],
        currentSavings: 0,
        createdAt: new Date(),
      });
    } catch {
      return new Error("Failed to save trip.");
    }
  };

  return { createNewTrip };
}
