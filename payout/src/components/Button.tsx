import React from "react";
import { Button, ButtonProps, Space } from "antd";

interface CustomButtonProps extends ButtonProps {
  title: string;
}

const CustomButton = ({ title, ...props }: CustomButtonProps) => {
  return <Button {...props}>{title}</Button>;
};

export default CustomButton;
