import { useEffect, useState } from "react";
import { db, auth } from "../../../../firebase-config";
import { MapSettings, MapViewStyles } from "../../types";
import { DEFAULT_ICON_STYLES } from "../../constants";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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

    const fetchSettings = async (userId: string) => {
      try {
        const tripRef = doc(db, `users/${userId}/trips/${tripId}`);
        const tripSnap = await getDoc(tripRef);
        const data = tripSnap.data();

        const iconStyles =
          data?.settings?.iconStyles ?? DEFAULT_MAP_SETTINGS.iconStyles;
        const mapStyle =
          data?.settings?.mapStyle ?? DEFAULT_MAP_SETTINGS.mapStyle;

        setMapSettings({ iconStyles, mapStyle });
      } catch {
        setError("Failed to fetch map settings.");
      } finally {
        setLoading(false);
      }
    };

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      fetchSettings(user.uid);
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [tripId]);

  return { mapSettings, loading, error };
};
