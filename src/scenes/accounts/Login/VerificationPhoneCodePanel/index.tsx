import "./index.less"

import * as React from "react"

import { Col, Input, Row, Form, Button } from "antd"
import AccountStore from "../../../../stores/accountStore"
import AuthenticationStore from "../../../../stores/authenticationStore"
import { L } from "../../../../lib/abpUtility"
import SessionStore from "../../../../stores/sessionStore"
import { validateMessages } from "@lib/validation"
import rules from "@scenes/accounts/Login/index.validation"
import { useHistory } from "react-router-dom"
import { userLayout } from "@components/Layout/Router/router.config"

export interface ILoginProps {
  authenticationStore?: AuthenticationStore;
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
  history: any;
  location: any;
  verifyPhone: (code) => void;
}

function VerificationPhoneCodePanel(props: ILoginProps) {
  const handleVerifyPhoneCode = async (values) => {
    props.verifyPhone(values.userNameOrEmailAddress)
  }
  const history = useHistory()

  const handleForgotPasswordClick = () => {
    const forgotPasswordPath = userLayout.forgotPassword.path
    history.push(forgotPasswordPath)
  }

  return (
    <Form
      onFinish={handleVerifyPhoneCode}
      validateMessages={validateMessages}
      layout={"vertical"}
      size="large"
    >
      <Row style={{ marginTop: "60px" }}>
        <Col span={24} offset={0}>
          <Form.Item
            name="userNameOrEmailAddress"
            rules={rules.userNameOrEmailAddress}
            label={L("USERNAME_OR_EMAIL")}
          >
            <Input placeholder={L("USERNAME_OR_EMAIL")} size="large" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Button
            style={{ width: "100%", marginTop: "10px" }}
            type="primary"
            htmlType="submit"
            loading={props.authenticationStore?.isLoading || false}
            shape="round"
          >
            {L("BTN_VERIFY")}
          </Button>
        </Col>
        <Col span={24} style={{ margin: "20px 0", textAlign: "center" }}>
          <a
            href="#"
            onClick={handleForgotPasswordClick}
            style={{ fontWeight: 600 }}
          >
            {L("FORGOT_PASSWORD")}
          </a>
        </Col>
      </Row>
    </Form>
  )
}

export default VerificationPhoneCodePanel
