import { Layout } from "antd";
import { Typography } from "antd";
const { Title } = Typography;

import Head from "next/head";
import SignupForm from "@/components/SignupForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout.Content style={{ width: "40vw", margin: "0 auto" }}>
          <Title style={{ textAlign: "center" }}>Register Company</Title>
          <SignupForm />
        </Layout.Content>
      </main>
    </>
  );
}
