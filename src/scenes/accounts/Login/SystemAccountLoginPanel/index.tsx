import "./index.less"

import * as React from "react"

import { Button, Col, Row, Form } from "antd"
import AccountStore from "../../../../stores/accountStore"
import AuthenticationStore from "../../../../stores/authenticationStore"
import { useNavigate } from "react-router-dom"
import SessionStore from "../../../../stores/sessionStore"
import rules from "./index.validation"
import { validateMessages } from "../../../../lib/validation"
import { userLayout } from "@components/Layout/Router/router.config"
// import { LeftOutlined } from "@ant-design/icons";
import FormInput from "@components/FormItem/FormInput"
import FormInputPassword from "@components/FormItem/FormInput/FormInputPassword"
import { L } from "@lib/abpUtility"

export interface ILoginProps {
  authenticationStore?: AuthenticationStore
  sessionStore?: SessionStore
  accountStore?: AccountStore
  history: any
  location: any
  handleBack: () => void
}

function SystemAccountLoginPanel(props: ILoginProps) {
  const formRef: any = React.createRef()
  const handleSubmit = async (values: any) => {
    const { loginModel } = props.authenticationStore!
    if (values) {
      await props.authenticationStore!.login(values)
      sessionStorage.setItem("rememberMe", loginModel.rememberMe ? "1" : "0")
      const { state } = props.location

      if (state?.from?.pathname === "/logout") {
        return (window.location.href = "/")
      }
      return (window.location =
        state && state.from.pathname !== "/"
          ? state.from.pathname
          : "/inquiries") //default login
    }
  }
  const navigate = useNavigate()

  const handleForgotPasswordClick = () => {
    const forgotPasswordPath = userLayout.forgotPassword.path
    navigate(forgotPasswordPath)
  }
  return (
    <Form
      ref={formRef}
      onFinish={handleSubmit}
      validateMessages={validateMessages}
      layout={"vertical"}
    >
      <Row style={{ marginTop: "20px" }} gutter={[16, 16]}>
        {/* <Col span={4} className="h-100 text-center">
          <Button
            className="rounded"
            size="large"
            icon={
              <LeftOutlined style={{ fontSize: "16px", color: "#d3a429" }} />
            }
            onClick={() => props.handleBack()}
          />
        </Col> */}
        <Col span={24}>
          <div className="w-100 text-center ml-1">
            <h2 className="ml-1">{L("LOGIN_WITH_ACCOUNT")}</h2>
          </div>
        </Col>
        <Col span={24} offset={0}>
          <FormInput
            name="userNameOrEmailAddress"
            rule={rules.userNameOrEmailAddress}
            label={L("USERNAME_OR_EMAIL")}
          />
        </Col>
        <Col span={24} offset={0}>
          <FormInputPassword
            name="password"
            rule={rules.password}
            label={L("PASSWORD")}
          />
          {/* <Form.Item
            name="password"
            rules={rules.password}
            label={L("PASSWORD")}
          >
            <Input.Password placeholder={L("PASSWORD")} size="large" />
          </Form.Item> */}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Button
            style={{ width: "100%", marginTop: "10px" }}
            htmlType={"submit"}
            type="primary"
            loading={props.authenticationStore?.isLoading || false}
            shape="round"
          >
            {L("BTN_LOGIN")}
          </Button>
        </Col>
        {/* <Col span={24} style={{ marginTop: "20px", textAlign: "center" }}>
          <Link
            to={{ pathname: userLayout.register.path }}
            style={{ fontWeight: 600 }}
          >
            {L("REGISTER")}
          </Link>
        </Col> */}
        <Col span={24} style={{ marginTop: "10px", textAlign: "center" }}>
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

export default SystemAccountLoginPanel
