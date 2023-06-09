import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  UploadProps,
  UploadFile,
  notification,
} from "antd";
import { UserOutlined, InboxOutlined } from "@ant-design/icons";
import { useCompany } from "@/hooks/useCompany";
import { useCompanyFactory } from "@/hooks/useCompanyFactory";

const SignupForm = () => {
  const [form] = Form.useForm();
  const [employeeList, setEmployeeList] = useState<UploadFile<any> | File>();
  const { createCompany } = useCompanyFactory();
  const { uploadCsv, addAddress } = useCompany();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    console.log(values);
    console.log(employeeList);
    if (employeeList) {
      setLoading(true);
      const companyAddress = await createCompany(values.name);
      addAddress(companyAddress);
      await uploadCsv(employeeList, companyAddress);
    } else
      notification.error({
        message: "Error",
        description: "Please upload employee list",
      });
    setLoading(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".csv",
    onChange(info) {
      info.file.status = "done";
      setEmployeeList(info.file);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
      setEmployeeList(e.dataTransfer.files[0]);
    },
  };

  return (
    <Form form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item
        name="name"
        rules={[
          { required: true, message: "Name is required" },
          {
            min: 3,
            message: "Name must be at least 3 characters long",
          },
          {
            max: 20,
            message: "Name must be at most 20 characters long",
          },
        ]}
      >
        <Input
          size="large"
          placeholder="Name of the company"
          style={{ marginTop: "4%" }}
          prefix={
            <UserOutlined
              style={{
                marginRight: "5px",
                color: "#2697ff",
              }}
            />
          }
        />
      </Form.Item>
      {/* <Form.Item
        name="email"
        rules={[
          { required: true, message: "Email is required" },
          {
            type: "email",
            message: "Email is not valid",
          },
        ]}
      >
        <Input
          size="large"
          placeholder="Email"
          prefix={
            <MailOutlined
              style={{
                marginRight: "5px",
                color: "#2697ff",
              }}
            />
          }
        />
      </Form.Item> */}
      {/* <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Password is required",
          },
          {
            min: 6,
            message: "Password must be at least 6 characters long",
          },
          {
            max: 20,
            message: "Password must be at most 20 characters long",
          },
          {
            pattern: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"),
            message:
              "Password must contain at least one uppercase letter, one lowercase letter and one number",
          },
        ]}
      > */}
      {/* <Input.Password
          size="large"
          placeholder="Password"
          prefix={
            <LockOutlined
              style={{
                marginRight: "5px",
                color: "#2697ff",
              }}
            />
          }
        />
      </Form.Item> */}
      <Upload.Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Employee List</p>
        <p className="ant-upload-hint">
          Click or drag a .csv file to this area to upload. Make sure the file
          consists of column of employee wallet address
        </p>
      </Upload.Dragger>
      <Form.Item
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "10vw", marginRight: "20px" }}
          loading={loading}
        >
          Register
        </Button>
        <Button htmlType="button" onClick={onReset} style={{ width: "10vw" }}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignupForm;
