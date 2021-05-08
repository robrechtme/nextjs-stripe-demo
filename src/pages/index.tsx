import { useState } from "react";
import styled from "styled-components";
import { fetchPostJSON } from "../utils/apiHelpers";
import getStripe from "../utils/getStripe";
import dynamic from "next/dynamic";
const Background = dynamic(() => import("../components/Background"), {
  ssr: false,
});

const H1 = styled.h1`
  font-size: 3em;
  max-width: 8ch;
  color: #1b2533;
  margin-bottom: 0em;
`;
const H2 = styled.h2`
  margin-top: 0em;
  font-weight: 500;
  color: #4e5968;
`;
const TitleContainer = styled.div`
  display: flex;
  align-self: flex-start;
  justify-content: flex-end;
  margin: 0 5rem;
  @media (max-width: 800px) {
    margin: 0 1rem;
    justify-content: flex-start;
  }
`;
const Button = styled.button`
  background: linear-gradient(340deg, #4973ff, #9ab2ff);
  color: #1b2533;
  outline: none;
  border: none;
  color: white;
  padding: 0.75rem;
  margin-top: 2rem;
  border-radius: 0.25rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  &:focus {
    box-shadow: 0 0 0 2px #7aacfe;
    outline: none;
  }
`;

const Layout = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  max-width: 25rem;
  padding: 1.5rem;
  margin: 0 1rem;
  border-radius: 0.25rem;
  background-color: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8em;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const Input = styled.input`
  min-width: 10ch;
  margin-bottom: 1rem;
  border-radius: 0;
  padding: 0.5rem 0.25rem;
  border: 1px solid #ddd;

  &:focus {
    box-shadow: 0 0 0 2px #7aacfe;
    outline: none;
  }
`;

const NumberInput = styled(Input)`
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  max-width: 3ch;
`;

const NumberButton = styled.button`
  background: white;
  outline: none;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 0;
  margin-bottom: 1rem;
  &:focus {
    box-shadow: 0 0 0 2px #7aacfe;
    outline: none;
  }
`;

const NumberField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const Marker = styled.strong`
  font-weight: unset;
  background-image: linear-gradient(120deg, #b8c9ff, #b8c9ff);
  background-repeat: no-repeat;
  background-size: 100% 0.4em;
  background-position: 0 88%;
`;

const IndexPage = () => {
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState<string | undefined>();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleCheckout = async () => {
    setError(undefined);
    // Create a Checkout Session.
    const stripeSession = await fetchPostJSON("/api/checkout_sessions", {
      amount,
      email,
      name,
    });

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
      <Background />
      <Layout>
        <TitleContainer>
          <div>
            <H1>
              Doneer een <Marker>koffie</Marker>.
            </H1>
            <H2>Aan Robrecht</H2>
          </div>
        </TitleContainer>
        <Card>
          <Label>Naam</Label>
          <Input
            id="name"
            type="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label>Ik doneer</Label>
          <NumberField>
            <span>
              <NumberButton onClick={() => setAmount(Math.max(1, amount - 1))}>
                -
              </NumberButton>
              <NumberInput
                type="number"
                value={amount}
                min={1}
                onChange={(e) => setAmount(parseInt(e.target.value))}
              />
              <NumberButton onClick={() => setAmount(amount + 1)}>
                +
              </NumberButton>{" "}
              koffie{amount > 1 ? "s" : ""}
            </span>
            <span>
              {new Intl.NumberFormat("nl-BE", {
                style: "currency",
                currency: "EUR",
              }).format(amount * 1.5)}
            </span>
          </NumberField>
          <Button onClick={handleCheckout}>Doneer</Button>
          {error}
        </Card>
      </Layout>
    </>
  );
};

export default IndexPage;
