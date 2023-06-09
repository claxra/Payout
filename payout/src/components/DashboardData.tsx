import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

interface IDataProps {
  data: {
    name: string;
    value: string;
  };
}

const DashboardData = ({ data }: IDataProps) => {
  return (
    <Card
      hoverable
      style={{
        width: 250,
        backgroundColor: "white",
      }}
    >
      <Title level={4}>{data.name}</Title>
      <Title level={2}>{data.value}</Title>
    </Card>
  );
};

export default DashboardData;
