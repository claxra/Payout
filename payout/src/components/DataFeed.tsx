import { useEffect, useState } from "react";
import { Alert, Card } from "antd";

import { ethers } from "ethers";
const provider = new ethers.providers.JsonRpcProvider(
  "https://indulgent-dark-mountain.ethereum-goerli.discover.quiknode.pro/6d7a41163b4dbaf098f785a46e59842b03850f73/"
);

const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const conversionAddresses = [
  {
    from: "BTC",
    to: "ETH",
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  },
  {
    from: "BTC",
    to: "USD",
    address: "0xA39434A63A52E749F02807ae27335515BA4b07F7",
  },
  {
    from: "CZK",
    to: "USD",
    address: "0xAE45DCb3eB59E27f05C170752B218C6174394Df8",
  },
  {
    from: "DAI",
    to: "USD",
    address: "0x0d79df66BE487753B02D015Fb622DED7f0E9798d",
  },
  {
    from: "ETH",
    to: "USD",
    address: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
  {
    from: "EUR",
    to: "USD",
    address: "0x44390589104C9164407A0E0562a9DBe6C24A0E05",
  },
  {
    from: "FORTH",
    to: "USD",
    address: "0x7A65Cf6C2ACE993f09231EC1Ea7363fb29C13f2F",
  },
  {
    from: "GBP",
    to: "USD",
    address: "0x73D9c953DaaB1c829D01E1FC0bd92e28ECfB66DB",
  },
  {
    from: "JPY",
    to: "USD",
    address: "0x982B232303af1EFfB49939b81AD6866B2E4eeD0B",
  },
  {
    from: "LINK",
    to: "ETH",
    address: "0xb4c4a493AB6356497713A78FFA6c60FB53517c63",
  },
  {
    from: "LINK",
    to: "USD",
    address: "0x48731cF7e84dc94C5f84577882c14Be11a5B7456",
  },
  {
    from: "SNX",
    to: "USD",
    address: "0xdC5f59e61e51b90264b38F0202156F07956E2577",
  },
  {
    from: "StakeStar PoR",
    to: null,
    address: "0xcd3BBd46c6c6354e3B03780F99E9836d3AC7740b",
  },
  {
    from: "USDC",
    to: "USD",
    address: "0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7",
  },
  {
    from: "XAU",
    to: "USD",
    address: "0x7b219F57a8e9C7303204Af681e9fA69d17ef626f",
  },
];

// const fromCurrencies = conversionAddresses.map(({ from }) => from);
// const toCurrencies = conversionAddresses.map(({ to }) => to);

type DataFeedProps = {
  fromCurrency: string;
};

const DataFeed = ({ fromCurrency }: DataFeedProps) => {
  const [data, setData] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const addr = conversionAddresses.find(
          ({ from }) => from === fromCurrency
        )?.address;

        console.log("Address", addr);

        if (!addr) {
          return;
        }

        const priceFeed = new ethers.Contract(
          addr,
          aggregatorV3InterfaceABI,
          provider
        );
        const roundData: any = await priceFeed.latestRoundData();
        console.log("Latest Round Data", roundData);

        const decimal: number = await priceFeed.decimals();
        console.log("Decimal", decimal);

        setData(roundData.answer.toNumber() / 10 ** decimal);
      } catch (error: any) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, [fromCurrency]);

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert type="error" message={error} />;
  return (
    <Card style={{ marginTop: 20 }} title="Investment Info">
      {data}
    </Card>
  );
};

export default DataFeed;
