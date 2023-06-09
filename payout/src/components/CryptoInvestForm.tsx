import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Checkbox,
  Dropdown,
  Space,
  MenuProps,
  DatePickerProps,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useCompany } from "@/hooks/useCompany";
import { getSolidityDate } from "@/lib/helper";
const { TextArea } = Input;

const currencySymbols = [
  "BTC",
  "ETH",
  "USDC",
  "BICO",
  "PUSH",
  "BNB",
  "USDT",
  "UNI",
  "LINK",
  "FIL",
];

const items: MenuProps["items"] = currencySymbols.map((symbol, index) => {
  return {
    key: index.toString(),
    label: symbol,
  };
});

function CryptoInvestForm() {
  const { companyContract } = useCompany();
  const [title, setTitle] = React.useState<string>("");
  const [currencySymbol, setCurrencySymbol] = React.useState<string>(
    currencySymbols[0]
  );
  const [amount, setAmount] = React.useState<number>(0);
  const [deadlineVote, setDeadlineVote] = React.useState<any>("");
  const [proposal, setProposal] = React.useState<string>("");

  const onClick = ({ key }: any) => {
    setCurrencySymbol(currencySymbols[key]);
  };

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setDeadlineVote(date);
  };

  const submitCryptoProposalHandler = async () => {
    if (companyContract) {
      try {
        const res = await companyContract.createCryptoProposal(
          title,
          proposal,
          getSolidityDate(deadlineVote),
          amount,
          currencySymbol
        );
        console.log("SUBMIT CRYPTO INVESTMENT: ", res);
      } catch (err) {
        console.log("ERROR WHILE SUBMITTING CRYPTO INVESTMENT: ", err);
      }
    }
  };

  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      <Form layout="vertical">
        <Form.Item label="Title">
          <Input
            onChange={(val: any) => {
              setTitle(val);
            }}
          />
        </Form.Item>
        <Form.Item label="Proposal">
          <TextArea
            rows={5}
            onChange={(event: any) => {
              setProposal(event.target.value);
            }}
          />
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Form.Item label="Amount to be invested ">
            <InputNumber
              onChange={(val: any) => {
                setAmount(val);
              }}
            />
          </Form.Item>
          <Form.Item label="Deadline to Vote ">
            <DatePicker onChange={onDateChange} />
          </Form.Item>
        </div>
        <Form.Item label="Currency/Token to invest into ">
          <Dropdown menu={{ items, onClick }} trigger={["click"]}>
            <Space>
              {currencySymbol}
              <DownOutlined />
            </Space>
          </Dropdown>
        </Form.Item>
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button onClick={submitCryptoProposalHandler}>Submit Proposal</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CryptoInvestForm;
