import React from "react";
import { Typography } from "antd";
import styles from "@/styles/page-styles/dashboard.module.css";
import DashboardData from "@/components/DashboardData";
import Timer from "@/components/Timer";

const { Title } = Typography;

const data = [
  {
    name: "Total Pension",
    value: "$10",
  },
  {
    name: "Total Employees",
    value: "1000",
  },
  {
    name: "Total Profit",
    value: "10.45%",
  },
];
const Dashboard = () => {
  return (
    <>
      <div className={styles.timer__wrapper}>
        <Timer />
      </div>
      <div className={styles.main__wrapper}>
        <div className={styles.main__left__wrapper}>
          <div className={styles.mid__wrapper}>
            {data.map((data, index) => (
              <DashboardData key={index} data={data} />
            ))}
          </div>
        </div>
        <div className="main__right__wrapper">
          {/* TODO DISPLAY THE EMPLOYEE LIST */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
