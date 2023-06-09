import React, { useState } from "react";
import { Button, Space } from "antd";
import { Checkbox } from "antd";
import { useCompany } from "@/hooks/useCompany";
import { notification } from "antd";
interface IProps {
  title: string;
  deadline: string;
  amount: number;
  content: string;
  id: any;
}

function ShowInvestmentDetails({
  title,
  deadline,
  amount,
  content,
  id,
}: IProps) {
  const [componentEnabled, setComponentEnabled] = useState<boolean>(false);

  const { companyContract } = useCompany();
  const approveInvestmentHandler = async () => {
    if (companyContract) {
      companyContract
        .approveW2wProposal(id)
        .then((res) => {
          console.log("APPROVED PROPOSAL: ", res);
          notification.success({
            message: "Proposal Approved",
            description:
              "Proposal has been approved successfully. Your vote has been counted",
          });
        })
        .catch((err) => {
          console.log("ERROR IN APPROVING PROPOSAL: ", err);
        });
    }
  };

  const rejectOrAbstainInvestmentHandler = () => {
    notification.success({
      message: "Proposal Disapproved",
      description:
        "Proposal has been disapproved successfully. Your vote has been counted",
    });
  };

  const finalizeW2WProposalHandler = () => {
    if (companyContract) {
      companyContract
        .finalizeW2wProposal(id)
        .then((res) => {
          console.log("FINALIZED PROPOSAL: ", res);
          notification.success({
            message: "Proposal Finalized",
            description:
              "Proposal has been finalized successfully. Your vote has been counted",
          });
        })
        .catch((err) => {
          console.log("ERROR IN FINALIZING PROPOSAL: ", err);
        });
    }
  };

  return (
    <div style={{ color: "black" }}>
      <h1>
        {title} #{id}
      </h1>
      <p>Deadline : {deadline}</p>
      <p>{content}</p>
      <p>Amount payable : {amount}</p>
      <p>Expected Amount : 10000</p>

      <div>
        <Checkbox
          checked={componentEnabled}
          onChange={(e) => setComponentEnabled(e.target.checked)}
        >
          I have read the terms and details of the investment
        </Checkbox>
        {typeof window !== "undefined" ? (
          <div>
            {localStorage.getItem("isCompany") === "true" ? (
              <div>
                <Button type="primary" onClick={finalizeW2WProposalHandler}>
                  Finalize
                </Button>
              </div>
            ) : (
              <div className="Buttons-container" style={{ paddingTop: 20 }}>
                <Space wrap>
                  <Button
                    type="primary"
                    style={{ backgroundColor: "green" }}
                    disabled={!componentEnabled}
                    onClick={approveInvestmentHandler}
                  >
                    Yes
                  </Button>
                  <Button
                    type="primary"
                    danger
                    disabled={!componentEnabled}
                    onClick={rejectOrAbstainInvestmentHandler}
                  >
                    No
                  </Button>
                  <Button
                    type="primary"
                    style={{ backgroundColor: "gray" }}
                    disabled={!componentEnabled}
                    onClick={rejectOrAbstainInvestmentHandler}
                  >
                    Abstain
                  </Button>
                </Space>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ShowInvestmentDetails;
