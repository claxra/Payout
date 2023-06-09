import { List } from "antd";
import ShowInvestCard from "./ShowInvestCard";

const InvestmentList = ({ investments }) => {
  return (
    <List>
      {investments.map((investment, index) => {
        return (
          <List.Item key={index}>
            <ShowInvestCard
              title={investment.title}
              deadline={investment.deadline}
              id={index}
            />
          </List.Item>
        );
      })}
    </List>
  );
};
export default InvestmentList;
