import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../../config/firebase-config";
import { DEFAULT_ICON_STYLES } from "../../constants";
import { MapSettings, MapViewStyles } from "../../types";

const DEFAULT_MAP_SETTINGS: MapSettings = {
  iconStyles: DEFAULT_ICON_STYLES,
  mapStyle: MapViewStyles.STREETS,
};

export const useGetMapSettings = (tripId: string) => {
  const [mapSettings, setMapSettings] =
    useState<MapSettings>(DEFAULT_MAP_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeAuth: (() => void) | null = null;
    let unsubscribeFirestore: (() => void) | null = null;

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const tripRef = doc(db, `users/${user.uid}/trips/${tripId}`);

      unsubscribeFirestore = onSnapshot(
        tripRef,
        (docSnap) => {
          const data = docSnap.data();

          const iconStyles =
            data?.settings?.iconStyles ?? DEFAULT_MAP_SETTINGS.iconStyles;
          const mapStyle =
            data?.settings?.mapStyle ?? DEFAULT_MAP_SETTINGS.mapStyle;

          setMapSettings({ iconStyles, mapStyle });
          setLoading(false);
        },
        () => {
          setError("Failed to fetch map settings.");
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [tripId]);

  return { mapSettings, loading, error };
};
