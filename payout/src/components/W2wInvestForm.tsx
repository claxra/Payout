import React, { useEffect } from "react";
import { Contract, ethers } from "ethers";
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  DatePickerProps,
} from "antd";
import { useCompany } from "@/hooks/useCompany";
import { getSolidityDate } from "@/lib/helper";
import { Router, useRouter } from "next/router";
const { TextArea } = Input;

function W2WInvestmentForm() {
  const [form] = Form.useForm();
  const { companyContract } = useCompany();
  const [deadlineVote, setDeadlineVote] = React.useState<Date>();
  const router = useRouter();

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setDeadlineVote(new Date(dateString));
  };

  const onFinish = (values: any) => {
    if (companyContract) {
      companyContract
        .createW2wProposal(
          values.title,
          values.proposal,
          getSolidityDate(deadlineVote),
          values.amount,
          values.recieverAddress
        )
        .then((res) => {
          console.log("W2W PROPOSAL SUBMITTED", res);
          router.push("/view-investment-proposals");
        });
    }
  };

  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Proposal" name="proposal">
          <TextArea rows={5} />
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Form.Item label="Amount to be invested" name="amount">
            <InputNumber />
          </Form.Item>
          <Form.Item label="Deadline to Vote">
            <DatePicker onChange={onDateChange} />
          </Form.Item>
        </div>
        <Form.Item label="Reciever Address" name="recieverAddress">
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button htmlType="submit">Submit Proposal</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default W2WInvestmentForm;
