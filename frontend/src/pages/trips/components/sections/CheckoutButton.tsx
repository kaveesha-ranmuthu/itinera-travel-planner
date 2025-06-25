import SmallButton from "../SmallButton";
import { useStripeSubscriptionCheckout } from "../../../../hooks/useStripeSubscriptionCheckout";

const PRICE_ID = "price_1RdhfoBQXwlrXuqxAtxzWpqN";

export const CheckoutButton = () => {
  const { createCheckoutSession, error, loading } =
    useStripeSubscriptionCheckout();

  console.log(error, loading);

  const handleClick = () => {
    createCheckoutSession(PRICE_ID, {
      successUrl: window.location.origin + "/billing-success",
      cancelUrl: window.location.origin + "/billing-cancel",
    });
  };

  return (
    <SmallButton className="text-sm" onClick={handleClick}>
      Upgrade to Premium
    </SmallButton>
  );
};
