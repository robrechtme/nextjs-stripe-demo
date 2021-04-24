import { NextPage } from "next";
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import { fetchGetJSON } from "../utils/apiHelpers";
import useWindowSize from "../hooks/useWindowSize";
import Confetti from "react-confetti";

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
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
        <Confetti
          width={width || 0}
          height={height || 0}
          confettiSource={{ x: 0.5 * width!, y: 0.1 * height!, w: 100, h: 100 }}
          recycle={false}
          run={data?.payment_intent?.status === "succeeded"}
          colors={["#c97c7c", "#78bd92", "#dde598", "#7c8abd", "#dfa863"]}
        />
      </div>
      <div>
        <h1>Checkout Payment Result</h1>
        <h2>Status: {data?.payment_intent?.status ?? "loading..."}</h2>
        <Link href="/">
          <a>Nog doneren</a>
        </Link>
      </div>
    </>
  );
};

export default SuccessPage;
