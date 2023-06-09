import "antd/dist/reset.css";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";
import { Modal } from "antd";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import type { AppProps } from "next/app";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useContractEvent } from "wagmi";
import CustomLayout from "@/components/Layout";
import CompanyJSON from "@/contracts/Company.json";

export default function App({ Component, pageProps }: AppProps) {
  const [pensionTransferEvent, setPensionTransferEvent] = useState<any>();

  const { chains, provider } = configureChains(
    [polygonMumbai],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "Payout",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  useContractEvent({
    address: `0x${
      typeof window !== "undefined"
        ? localStorage.getItem("companyAddress")?.slice(2)
        : ""
    }`,
    abi: CompanyJSON.abi,
    eventName: "CompanyPensionTransferSucceeded",
    listener: (event) => {
      console.log("EVENT: ", event);
      setPensionTransferEvent(event);
    },
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <Modal
        title="Pension Transfer"
        visible={pensionTransferEvent !== undefined}
        onOk={() => setPensionTransferEvent(undefined)}
        onCancel={() => setPensionTransferEvent(undefined)}
      >
        Successfully Transferred the pension of amount:
        {pensionTransferEvent?.returnValues?.amount} from{" "}
        {pensionTransferEvent?.returnValues?.company}
      </Modal>

      <RainbowKitProvider chains={chains} initialChain={polygonMumbai}>
        <CustomLayout>
          <Component {...pageProps} />
        </CustomLayout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
