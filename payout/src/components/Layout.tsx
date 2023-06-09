import React, { useEffect } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { MenuProps, notification } from "antd";
import { Layout, Menu, theme, Button } from "antd";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Typography } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSigner } from "wagmi";

const { Title } = Typography;
const { Header, Content, Sider } = Layout;

// TODO ->  Edit the icons according to the above options

interface IProp {
  children: React.ReactNode;
}
const CustomLayout = ({ children }: IProp) => {
  const router = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { data: signer } = useSigner();
  const [signerAddress, setSignerAddress] = React.useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [isCompany, setIsCompany] = React.useState<boolean>(false);
  const [isEmployee, setIsEmployee] = React.useState<boolean>(false);
  const [optionNames, setOptionNames] = React.useState([
    "Register Company",
    "Dashboard",
    "Propose an Investment",
    "View Investment Proposals",
  ]);
  const [optionRoutes, setOptionRoutes] = React.useState([
    "/register-company",
    "/dashboard",
    "/propose-investment",
    "/view-investment-proposals",
  ]);
  const [iconsList, setIconsList] = React.useState([
    UserOutlined,
    DashboardOutlined,
    LaptopOutlined,
    NotificationOutlined,
  ]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      setIsLoggedIn(true);
    }
    const isCompany = localStorage.getItem("isCompany") === "true";
    setIsCompany(isCompany);
    const isEmployee = localStorage.getItem("isEmployee") === "true";
    setIsEmployee(isEmployee);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      if (isCompany) {
        setOptionNames([
          "Dashboard",
          "Propose an Investment",
          "View Investment Proposals",
        ]);
        setOptionRoutes([
          "/dashboard",
          "/propose-investment",
          "/view-investment-proposals",
        ]);
        setIconsList([DashboardOutlined, LaptopOutlined, NotificationOutlined]);
      } else {
        setOptionNames(["Dashboard"]);
        setOptionRoutes(["/dashboard"]);
        setIconsList([DashboardOutlined]);
      }
    } else {
      setOptionNames(["Register Company"]);
      setOptionRoutes(["/register-company"]);
      setIconsList([UserOutlined]);
    }
  }, [isLoggedIn, isCompany, isEmployee]);

  useEffect(() => {
    const getSignerAddress = async () => {
      const address = await signer?.getAddress();
      setSignerAddress(address);
    };
    getSignerAddress();
  }, [signer]);

  const items2: MenuProps["items"] = iconsList.map((icon, index) => {
    const key: String = String(index + 1);

    return {
      key: `${key}`,
      icon: React.createElement(icon),
      label: optionNames[index],
      onClick: () => {
        // navigate to the route
        router.push(optionRoutes[index]);
      },
    };
  });

  const loginAsEmployee = async () => {
    fetch("/api/login-employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: await signer?.getAddress(),
      }),
    }).then(async (res) => {
      setIsEmployee(true);
      setIsCompany(false);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("isEmployee", "true");
      localStorage.setItem("isCompany", "false");
      const data = await res.json();
      localStorage.setItem("employee", JSON.stringify(data.employee));
      localStorage.setItem("employeeCompany", JSON.stringify(data.company));
      notification.success({
        message: "Success",
        description: "Logged in successfully",
      });
    });
  };

  const loginAsCompany = async () => {
    fetch("/api/login-company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerAddress: await signer?.getAddress(),
      }),
    }).then(async (res) => {
      setIsCompany(true);
      setIsEmployee(false);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("isCompany", "true");
      localStorage.setItem("isEmployee", "false");
      const data = await res.json();
      localStorage.setItem("company", JSON.stringify(data.company));
      notification.success({
        message: "Success",
        description: "Logged in successfully",
      });
    });
  };

  return (
    <Layout style={{ height: "100vh", overflowY: "clip" }}>
      <Header className="header" style={{ padding: "35px 20px" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Link href="/">
            <Title style={{ color: "white", marginTop: 8 }} level={2}>
            Payout
            </Title>
          </Link>
          <div style={{ display: "flex", alignItems: "center" }}>
            {signerAddress && !isLoggedIn && (
              <>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: "16vw",
                    padding: "19px 0",
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={loginAsEmployee}
                >
                  Login as Employee
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    margin: 10,
                    width: "16vw",
                    padding: "19px 0",
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={loginAsCompany}
                >
                  Login as Company
                </Button>
              </>
            )}
            <ConnectButton showBalance accountStatus={"address"} />
          </div>
        </div>
      </Header>
      <Layout>
        <Sider
          width={250}
          style={{ background: colorBgContainer }}
          theme="dark"
          collapsible
        >
          <Menu
            mode="inline"
            defaultOpenKeys={["1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items2}
            theme="dark"
          ></Menu>
        </Sider>
        <Layout style={{ padding: "20px", overflowY: "auto" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              overflow: "scroll",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
