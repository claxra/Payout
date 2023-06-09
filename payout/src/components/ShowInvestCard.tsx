import React from "react";
import { Card } from "antd";
import { Button, Space } from "antd";
import { useRouter } from "next/router";

function ShowInvestCard(props: any) {
  const router = useRouter();

  const customNavigate = () => {
    router.push(`/proposal-details/${props.id}`);
  };

  return (
    <Card
      type="inner"
      title={props.title}
      extra={
        <>
          <Button type="primary" onClick={customNavigate}>
            View More
          </Button>
        </>
      }
    >
      <p>Vote By : {props.deadline}</p>
    </Card>
  );
}

export default ShowInvestCard;
