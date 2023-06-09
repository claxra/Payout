import InvestmentList from "@/components/InvestmentList";
import { useCompany } from "@/hooks/useCompany";
import { Tabs, Typography } from "antd";
import { useEffect, useState } from "react";
const { Title } = Typography;

const ViewInvestmentProposals = () => {
  const { companyContract } = useCompany();

  const [activeKey, setActiveKey] = useState("2");
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    // if (companyContract) {
    //   if (activeKey === "1") {
    //     companyContract
    //       .cryptoProposals()
    //       .then((res) => {
    //         // setInvestments(res);
    //         console.log("CRYPTO PROPOSAL", res);
    //       })
    //       .catch((err) => {
    //         console.log("ERROR WHILE FETCHING CRYPTO PROPOSALS: ", err);
    //       });
    //   } else {
    //     companyContract
    //       .w2wProposals()
    //       .then((res) => {
    //         // setInvestments(res);
    //         console.log("W2W PROPOSAL", res);
    //       })
    //       .catch((err) => {
    //         console.log("ERROR WHILE FETCHING W2W PROPOSALS: ", err);
    //       });
    //   }
    // }
  }, [activeKey, companyContract]);

  const tabItems = [
    {
      label: `Crypto Investment Proposals`,
      key: "1",
      children: <InvestmentList investments={investments} />,
    },
    {
      label: `W2W Investment Proposals`,
      key: "2",
      children: <InvestmentList investments={investments} />,
    },
  ];
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
      <Title style={{ textAlign: "center" }}>View Investment Proposals</Title>
      <Tabs
        style={{ width: "100%" }}
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
        }}
        centered
        items={tabItems}
      />
    </div>
  );
};

export default ViewInvestmentProposals;
