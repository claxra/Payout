import React from "react";
import { Button, Modal } from "antd";
import styles from "@/styles/component-styles/timer.module.css";
import { Form, Input, Upload, message, UploadProps, UploadFile } from "antd";
import form from "antd/es/form";

const Timer = () => {
  const [days, setDays] = React.useState(0);
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [modalSendPensionDefaultOpen, setModalSendPensionDefaultOpen] =
    React.useState(false);
  const [modalRecieveFundsDefaultOpen, setModalRecieveFundsDefaultOpen] =
    React.useState(false);

    const handleOkRecieveFunds = () => {
      setModalRecieveFundsDefaultOpen(false);
    };

    const handleOkSendFunds = () => {
      setModalSendPensionDefaultOpen(false);
    }
  

  const deadline = "March, 1, 2023";

  const getTimeLeft = (deadline: string) => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  React.useEffect(() => {
    const interval = setInterval(() => getTimeLeft(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={styles.timer}
      role="timer"
      style={{
        display: "flex",
        justifyContent: "space-between",
        color: "black",
        alignContent: "center",
      }}
    >
      <div
        className="col-4"
        style={{ width: "20%", float: "left", margin: "auto" }}
      >
        <div className="box">
          <span className="text">Days</span>
          <p id="day">{days < 10 ? "0" + days : days}</p>
        </div>
      </div>
      <div
        className="col-4"
        style={{ width: "20%", float: "left", margin: "auto" }}
      >
        <div className="box">
          <span className="text">Hours</span>
          <p id="hour">{hours < 10 ? "0" + hours : hours}</p>
        </div>
      </div>
      <div
        className="col-4"
        style={{ width: "20%", float: "left", margin: "auto" }}
      >
        <div className="box">
          <span className="text">Minutes</span>
          <p id="minute">{minutes < 10 ? "0" + minutes : minutes}</p>
        </div>
      </div>
      <div
        className="col-4"
        style={{ width: "20%", float: "left", margin: "auto" }}
      >
        <div className="box">
          <span className="text">Seconds</span>
          <p id="second">{seconds < 10 ? "0" + seconds : seconds}</p>
        </div>
      </div>
      <div style={{ alignContent: "center" }}>
        {/* <div
          className="button"
          style={{ alignContent: "center", padding: "10px" }}
        >
          <Button
            onClick={() => setModalSendPensionDefaultOpen(true)}
            type="primary"
          >
            Send Pension
          </Button>
          {sendPensionModal(
            modalSendPensionDefaultOpen,
            setModalSendPensionDefaultOpen,
            handleOkSendFunds
          )}
        </div> */}
        <div
          className="button"
          style={{ alignContent: "center", padding: "10px" }}
        >
          <Button
            onClick={() => setModalRecieveFundsDefaultOpen(true)}
            type="primary"
          >
            Add money to pension fund
          </Button>
          {recieveFundsModal(
            modalRecieveFundsDefaultOpen,
            setModalRecieveFundsDefaultOpen,
            handleOkRecieveFunds
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;

function recieveFundsModal(
  modalDefaultOpen: boolean,
  setModalDefaultOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onOk: any
) {
  return (
    <Modal open={modalDefaultOpen} onOk = {onOk} onCancel={() => setModalDefaultOpen(false)}>
      <Form>
        <Form.Item
          name="Transfer Amount to Employees"
          // rules={[
          //   { required: true, message: "Name is required" },
          //   {
          //     min: 3,
          //     message: "Name must be at least 3 characters long",
          //   },
          //   {
          //     max: 20,
          //     message: "Name must be at most 20 characters long",
          //   },
          // ]}
        >
          <Input
            size="large"
            placeholder="Transfer Amount to Pension Fund"
            style={{ marginTop: "4%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function sendPensionModal(
  modalDefaultOpen: boolean,
  setModalDefaultOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onOk: any
) {
  return (
    <Modal open={modalDefaultOpen} onCancel={() => setModalDefaultOpen(false)}>
      <Form>
        <Form.Item
          name="Transfer Amount to Employees"
          // rules={[
          //   { required: true, message: "Name is required" },
          //   {
          //     min: 3,
          //     message: "Name must be at least 3 characters long",
          //   },
          //   {
          //     max: 20,
          //     message: "Name must be at most 20 characters long",
          //   },
          // ]}
        >
          <Input
            size="large"
            placeholder="Transfer Amount to Employees"
            style={{ marginTop: "4%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
