import React from "react";
import LottieAnimation from "@/components/Lottie";
import investmentLottie from "@/assets/animations/investment.json";
import { Typography } from "antd";
const { Title } = Typography;

export default function Home() {
  return (
    <>
      <Title style={{ textAlign: "center" }}>Welcome to Payout</Title>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ textAlign: "center", color: "black", width: "60%", fontSize:17 }}>
          A pension payout is a flow of money from your employer to your pension
          fund. We present a decentralised solution that can make the pension
          system easy and transparent.
        </p>
      </div>
      <LottieAnimation
        lottieData={investmentLottie}
        height={"75%"}
        width={"40%"}
      />
    </>
  );
}
