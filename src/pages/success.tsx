import { NextPage } from "next";
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import { fetchGetJSON } from "../utils/apiHelpers";
import useWindowSize from "../hooks/useWindowSize";
import Confetti from "react-confetti";
import styled from "styled-components";

const COLORS = ["#806ae4", "#ff8b91", "#a0b0ff", "#FFFFFF", "#f384ff"];

const Page = styled.div`
  background-image: url(./bg.jpg);
  width: 100%;
  height: 100%;
  background-size: cover;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ConfettiContainer = styled.div`
  position: absolute;
  inset: 0;
`;

const SuccessPage: NextPage = () => {
  const { width, height } = useWindowSize();

  const router = useRouter();
  const { data, error } = useSWR(
    router.query.session_id
      ? `/api/checkout_sessions/${router.query.session_id}`
      : null,
    fetchGetJSON
  );

  if (error) return <div>failed to load</div>;

  return (
    <Page>
      {data?.payment_intent?.status === "succeeded" && (
        <Container>
          <h1>Gelukt, bedankt!</h1>
          <Link href="/">
            <a>Nog doneren</a>
          </Link>
        </Container>
      )}
      <ConfettiContainer>
        <Confetti
          width={width || 0}
          height={height || 0}
          confettiSource={{ x: 0.5 * width!, y: 0.1 * height!, w: 100, h: 100 }}
          run={data?.payment_intent?.status === "succeeded"}
          colors={COLORS}
        />
      </ConfettiContainer>
    </Page>
  );
};

export default SuccessPage;
