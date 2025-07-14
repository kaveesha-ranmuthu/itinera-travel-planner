import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  DocumentReference,
} from "firebase/firestore";
import { getAuth, User } from "firebase/auth";
import { db } from "../config/firebase-config";

interface CheckoutSessionOptions {
  successUrl?: string;
  cancelUrl?: string;
}

interface StripeCheckoutSessionDoc {
  url?: string;
  error?: { message: string };
}

export function useStripeSubscriptionCheckout() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (
    priceId: string,
    { successUrl, cancelUrl }: CheckoutSessionOptions = {}
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      const user: User | null = auth.currentUser;
      if (!user) throw new Error("User is not authenticated");

      // Write a checkout session doc to Firestore
      const docRef: DocumentReference = await addDoc(
        collection(db, `users/${user.uid}/checkout_sessions`),
        {
          price: priceId,
          ...(successUrl ? { success_url: successUrl } : {}),
          ...(cancelUrl ? { cancel_url: cancelUrl } : {}),
        }
      );

      // Listen for the Stripe session URL (extension will populate it)
      const unsubscribe = onSnapshot(
        doc(db, `users/${user.uid}/checkout_sessions/${docRef.id}`),
        (snap) => {
          const data = snap.data() as StripeCheckoutSessionDoc | undefined;
          if (data && data.url) {
            window.location.assign(data.url);
            unsubscribe(); // stop listening after redirect
          } else if (data && data.error) {
            setError(data.error.message || "Stripe session error");
            setLoading(false);
            unsubscribe();
          }
        }
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setLoading(false);
    }
  };

  return { createCheckoutSession, loading, error };
}
