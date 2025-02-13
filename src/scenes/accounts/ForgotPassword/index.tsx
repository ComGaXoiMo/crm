import "./index.less"
import * as React from "react"
import { Card, Col, Input, Row, Form, Button } from "antd"
import { LeftOutlined, UserOutlined } from "@ant-design/icons"
import { inject, observer } from "mobx-react"
import AccountStore from "../../../stores/accountStore"
import { L, LNotification } from "../../../lib/abpUtility"
import SessionStore from "../../../stores/sessionStore"
import Stores from "../../../stores/storeIdentifier"
import rules from "./index.validation"
import { validateMessages } from "../../../lib/validation"
import { userLayout } from "@components/Layout/Router/router.config"
import { LockOutlined } from "@ant-design/icons"
import Input6VerifyCode from "@components/Inputs/InputVerifyCode/Input6VerifyCode"
import accountService from "@services/account/accountService"
import firebase from "firebase"
import { notifySuccess } from "@lib/helper"
import { firebaseConfig } from "@lib/appconst"

declare let abp: any

export interface IForgotPasswordProps {
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
  history: any;
  location: any;
  form: any;
}

const forgotPassword = {
  sendRequest: 1,
  confirmCode: 2,
  resetPassword: 3,
  finish: 4,
}

@inject(Stores.SessionStore, Stores.AccountStore)
@observer
class ForgotPassword extends React.Component<IForgotPasswordProps> {
  formRef: any = React.createRef();
  state = {
    emailAddress: "",
    deviceReceiveConfirmCode: 0,
    code: "",
    errorMessage: undefined,
    idToken: "",
    forgotPasswordStep: forgotPassword.sendRequest,
    userNameOrEmailAddress: "",
  };

  componentDidMount(): void {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
      firebase.auth().languageCode = "vi"
    }
    const params = new URLSearchParams(this.props.location?.search)
    const emailAddress = params.get("emailaddress")
    const resetCode = params.get("resetCode")
    if (emailAddress && resetCode) {
      this.setState({
        forgotPasswordStep: forgotPassword.resetPassword,
        emailAddress,
      })
      const form = this.formRef.current
      form.setFieldsValue({ emailAddress, resetCode })
    }
  }

  handleSubmit = async (values: any) => {
    if (values) {
      switch (this.state.forgotPasswordStep) {
        case forgotPassword.sendRequest: {
          const sendSuccess =
            await this.props.accountStore!.requestForgotPassword(values)
          if (sendSuccess) {
            this.setState({
              forgotPasswordStep: forgotPassword.resetPassword,
              emailAddress: values.emailAddress,
            })
            abp.notify.success(
              LNotification("REQUEST_FORGOT_PASSWORD_SUCCESS")
            )
          }
          break
        }
        case forgotPassword.confirmCode: {
          this.setState({ forgotPasswordStep: forgotPassword.resetPassword })
          break
        }
        case forgotPassword.resetPassword: {
          const sendSuccess = await this.props.accountStore!.resetPassword({
            ...values,
            emailAddress: this.state.emailAddress,
          })
          if (sendSuccess) {
            this.setState({ forgotPasswordStep: forgotPassword.finish })
            abp.notify.success(LNotification("RESET_PASSWORD_SUCCESS"))
          }
          break
        }
      }
    }
  };

  backToLogin = () => {
    this.props.history.push(userLayout.accountLogin.path)
  };

  handleSendUsername = async () => {
    const form = this.formRef.current
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      }
    )
    const formValues = await form.validateFields()
    if (formValues.userNameOrEmailAddress) {
      const data = await accountService.SendPasswordResetCode({
        emailAddress: formValues.userNameOrEmailAddress,
      })
      await this.setState({ forgotPasswordStep: forgotPassword.confirmCode })
      this.setState({
        userNameOrEmailAddress: formValues.userNameOrEmailAddress,
      })

      if (data.state) {
        if (data.state === 2) {
          window.confirmationResult = await firebase
            .auth()
            .signInWithPhoneNumber(
              formValues.userNameOrEmailAddress,
              window.recaptchaVerifier
            )
            .catch((error) => {
              this.setState({ errorMessage: error.message })
              window.recaptchaVerifier.render().then(function (widgetId) {
                grecaptcha.reset(widgetId)
              })
            })
        }

        this.setState({
          deviceReceiveConfirmCode: data.state,
        })
        await notifySuccess("", L(data.message))
      }
    }
  };

  handleConfirmCode = async () => {
    if (this.state.code.length !== 6) return
    if (this.state.deviceReceiveConfirmCode === 2) {
      const confirmationResult = window.confirmationResult
      if (!confirmationResult) {
        return
      }
      await confirmationResult
        .confirm(this.state.code)
        .then(async (user) => {
          this.setState({ idToken: user.user.Aa })
          this.setState({ forgotPasswordStep: forgotPassword.resetPassword })
        })
        .catch((error) => {
          this.setState({ errorMessage: error.message })
        })
    }
    this.setState({ forgotPasswordStep: forgotPassword.resetPassword })
  };
  handleResetPassword = async () => {
    const params = new URLSearchParams(this.props.location?.search)
    const emailAddress =
      params.get("emailaddress") ?? this.state.userNameOrEmailAddress
    const resetCode = params.get("resetCode") ?? this.state.code
    const form = this.formRef.current
    const formValues = await form.validateFields()
    await accountService.resetPasswordUser({
      emailAddress: emailAddress,
      password: formValues.password,
      resetCode: resetCode,
    })

    await notifySuccess(L("SUCCESSFULLY"), L("RESET_PASSWORD_SUCCESSFULLY"))
    this.setState({ forgotPasswordStep: forgotPassword.finish })
  };

  public render() {
    const { forgotPasswordStep } = this.state
    const currentYear = new Date().getFullYear()

    return (
      <Form
        ref={this.formRef}
        validateMessages={validateMessages}
        layout={"vertical"}
        className="h-100"
      >
        <Row className="page-forgot-password">
          <Col xs={0} md={16} className="h-100 col-right">
            <span className="footer-copy-right">
              {L("COPY_RIGHT_{0}", currentYear)}
            </span>
          </Col>
          <Col xs={24} md={8} className="h-100 col-left name">
            <Card className="h-100">
              <div className="h-100 d-flex flex-column justify-content-around">
                <div style={{ textAlign: "center" }}>
                  <img src="/assets/images/logo.png" />
                  <br />
                  <img src="../../../assets/images/auth/union.png" />
                  <p className="mt-3 welcome-message">{L("WELCOME_MESSAGE")}</p>
                </div>
                <div className=" w-100">
                  <div id="recaptcha-container" />
                  <div style={{ maxWidth: "360px", margin: "auto" }}>
                    {forgotPasswordStep === forgotPassword.sendRequest && (
                      <Row className="mt-3">
                        <Col span={4} className="h-100 text-center">
                          <Button
                            className="rounded"
                            size="large"
                            icon={
                              <LeftOutlined
                                style={{ fontSize: "16px", color: "#d3a429" }}
                              />
                            }
                            onClick={this.backToLogin}
                          />
                        </Col>
                        <Col span={20}>
                          <div className="w-100">
                            <h2>{L("FORGOT_PASSWORD_TITLE")}</h2>
                            <div>{L("ENTER_YOUR_EMAIL_TO_RECEIVE_OTP")}</div>
                          </div>
                        </Col>
                        <Col span={24} offset={0} className="my-3">
                          <Form.Item
                            name="userNameOrEmailAddress"
                            rules={rules.userNameOrEmailAddress}
                            label={L("EMAIL_OR_PHONE_NUMBER")}
                          >
                            <Input
                              placeholder={L("EMAIL_OR_PHONE_NUMBER")}
                              prefix={
                                <UserOutlined
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24} className="mt-3 p-1">
                          <Button
                            style={{ width: "100%" }}
                            type="primary"
                            shape="round"
                            loading={
                              this.props.accountStore?.isLoading || false
                            }
                            onClick={() => this.handleSendUsername()}
                          >
                            {L("BTN_SEND")}
                          </Button>
                        </Col>
                      </Row>
                    )}
                    {forgotPasswordStep === forgotPassword.confirmCode && (
                      <Row className="mt-3">
                        <Col span={4} className="h-100 text-center">
                          <Button
                            className="rounded"
                            size="large"
                            icon={
                              <LeftOutlined
                                style={{ fontSize: "16px", color: "#d3a429" }}
                              />
                            }
                            onClick={this.backToLogin}
                          />
                        </Col>
                        <Col span={20}>
                          <div className="w-100">
                            <h2>{L("CONFIRM_CODE")}</h2>
                            <div>{L("ENTER_OTP")}</div>
                          </div>
                        </Col>
                        <div className="text-danger">
                          {this.state.errorMessage}
                        </div>
                        <Col span={24} offset={0} className="my-3">
                          <Input6VerifyCode
                            onChange={(code) => this.setState({ code })}
                          />
                        </Col>
                        <Col span={24} className="mt-3 p-1">
                          <Button
                            className="w-100"
                            type="primary"
                            shape="round"
                            onClick={() => this.handleConfirmCode()}
                            loading={
                              this.props.accountStore?.isLoading || false
                            }
                          >
                            {L("BTN_VERIFY_CODE")}
                          </Button>
                        </Col>
                      </Row>
                    )}
                    {forgotPasswordStep === forgotPassword.resetPassword && (
                      <Row className="mt-3">
                        <Col span={4} className="h-100 text-center">
                          <Button
                            size="large"
                            className="rounded"
                            icon={
                              <LeftOutlined
                                style={{ fontSize: "16px", color: "#d3a429" }}
                              />
                            }
                            onClick={this.backToLogin}
                          />
                        </Col>
                        <Col span={20}>
                          <div className="w-100">
                            <h2>{L("NEW_PASSWORD_TITLE")}</h2>
                            <div>{L("SET_UP_NEW_PASSWORD")}</div>
                          </div>
                        </Col>
                        <Col span={24} offset={0}>
                          <Form.Item
                            name="password"
                            rules={rules.password}
                            label={L("NEW_PASSWORD")}
                          >
                            <Input.Password
                              visibilityToggle
                              size="large"
                              placeholder={L("NEW_PASSWORD")}
                              prefix={
                                <LockOutlined
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
                              type="password"
                            />
                          </Form.Item>
                          <Form.Item
                            name="passwordRetype"
                            rules={rules.passwordRetype}
                            label={L("NEW_PASSWORD_RETYPE")}
                          >
                            <Input.Password
                              visibilityToggle
                              size="large"
                              placeholder={L("NEW_PASSWORD_RETYPE")}
                              prefix={
                                <LockOutlined
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
                              type="password"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24} className="mt-3 p-1">
                          <Button
                            style={{ width: "100%" }}
                            type="primary"
                            shape="round"
                            onClick={this.handleResetPassword}
                            loading={
                              this.props.accountStore?.isLoading || false
                            }
                          >
                            {L("BTN_RESET_PASSWORD")}
                          </Button>
                        </Col>
                      </Row>
                    )}
                    {forgotPasswordStep === forgotPassword.finish && (
                      <Row className="mt-3">
                        <Col span={4} className="h-100 text-center">
                          <Button
                            icon={
                              <LeftOutlined
                                style={{ fontSize: "14px", fontWeight: 600 }}
                              />
                            }
                            className="rounded"
                            onClick={this.backToLogin}
                          />
                        </Col>
                        <Col span={20} className="text-center">
                          <h2>{L("RESET_PASSWORD_SUCCESS_MESSAGE")}</h2>
                        </Col>
                      </Row>
                    )}
                  </div>
                </div>
                <div />
                <div />
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default ForgotPassword
