import React from "react";
import ShowInvestmentDetails from "@/components/ShowInvestmentDetails";
import { useRouter } from "next/router";

const ProposalDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="proposal__details">
      <h1>Proposal Details</h1>
      <ShowInvestmentDetails
        title="Investment Proposal 1"
        deadline="2021-08-01"
        amount={1000}
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed"
        id={id}
      />
    </div>
  );
};

export default ProposalDetails;
