import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../../../../firebase-config";

const useDuplicateTrip = () => {
  const duplicateTrip = async (sourceTripId: string) => {
    const user = auth.currentUser;
    if (!user) {
      return new Error("User not authenticated.");
    }
    const userId = user.uid;

    try {
      const sourceTripRef = doc(db, `users/${userId}/trips/${sourceTripId}`);
      const sourceTripSnap = await getDoc(sourceTripRef);

      if (!sourceTripSnap.exists()) return new Error("Trip not found");

      const newTripRef = await addDoc(
        collection(db, `users/${userId}/trips`),
        sourceTripSnap.data()
      );
      const newTripId = newTripRef.id;

      const subCollections = sourceTripSnap.data()?.subCollections;

      for (const sub of subCollections) {
        const sourceSubRef = collection(
          db,
          `users/${userId}/trips/${sourceTripId}/${sub}`
        );
        const subDocs = await getDocs(sourceSubRef);

        for (const docSnap of subDocs.docs) {
          const destDocRef = doc(
            db,
            `users/${userId}/trips/${newTripId}/${sub}/${docSnap.id}`
          );
          await setDoc(destDocRef, docSnap.data());
        }
      }
    } catch (error) {
      return (error as Error).message;
    }
  };

  return { duplicateTrip };
};

export default useDuplicateTrip;
