import { Typography } from "antd";
import { Tabs } from "antd";
const { Title } = Typography;

import CryptoInvestForm from "@/components/CryptoInvestForm";
import W2WInvestmentForm from "@/components/W2wInvestForm";

const tabItems = [
  {
    label: `Crypto Investment`,
    key: "1",
    children: <CryptoInvestForm />,
  },
  {
    label: `W2W Investment`,
    key: "2",
    children: <W2WInvestmentForm />,
  },
];

const ProposeInvestment = () => {
  return (
    <div
      style={{
        margin: "0 auto",
        width: "60%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Title style={{ textAlign: "center" }}>
        Propose Investment
      </Title>
      <Tabs
        style={{ width: "100%" }}
        defaultActiveKey="1"
        centered
        items={tabItems}
      />
    </div>
  );
};

export default ProposeInvestment;
