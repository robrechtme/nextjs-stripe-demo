import { useState } from "react";
import { fetchPostJSON } from "../utils/apiHelpers";
import getStripe from "../utils/getStripe";

const IndexPage = () => {
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState<string | undefined>();
  const [email, setEmail] = useState("");

  const handleCheckout = async () => {
    setError(undefined);
    // Create a Checkout Session.
    const stripeSession = await fetchPostJSON("/api/checkout_sessions", {
      amount,
      email,
    });

    console.log(stripeSession);

    if (stripeSession.statusCode === 500) {
      console.error((stripeSession as any).message);
      setError(stripeSession.message);
      return;
    }

    // Redirect to Checkout.
    const { id: sessionId } = stripeSession;
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId,
    });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <style jsx>{`
        /* Chrome, Safari, Edge, Opera */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <h1>Doneer</h1>
      <p>
        Doneer
        <button onClick={() => setAmount(Math.max(1, amount - 1))}>-</button>
        <input
          type="number"
          value={amount}
          min={1}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />
        <button onClick={() => setAmount(amount + 1)}>+</button>
        koffie{amount > 1 ? "s" : ""}
      </p>
      <label>
        Email
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button onClick={handleCheckout}>Doneer</button>
      {error}
    </>
  );
};

export default IndexPage;
