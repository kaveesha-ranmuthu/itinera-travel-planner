import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../../firebase-config";
import { Trip } from "../../TripsLandingPage";

export function useCreateNewTrip() {
  const createNewTrip = async (trip: Trip) => {
    const {
      tripName,
      startDate,
      endDate,
      budget,
      countries,
      currency,
      numberOfPeople,
      imageData,
    } = trip;
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
        subCollections: [
          "transport",
          "food",
          "accommodation",
          "activities",
          "itinerary",
          "packing list",
        ],
        taskList: `
          <ul data-type="taskList">
            <li data-type="taskItem" data-checked="false">Start typing...</li>
          </ul>
        `,
        currentSavings: 0,
        updatedAt: new Date(),
      });
    } catch {
      return new Error("Failed to save trip.");
    }
  };

  return { createNewTrip };
}
