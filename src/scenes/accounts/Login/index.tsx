import "./index.less"

import * as React from "react"

import { Button, Card, Col, Row } from "antd"
import { inject, observer } from "mobx-react"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import AccountStore from "../../../stores/accountStore"
import AuthenticationStore from "../../../stores/authenticationStore"
import { L } from "../../../lib/abpUtility"
import SessionStore from "../../../stores/sessionStore"
import Stores from "../../../stores/storeIdentifier"
import { loginSteps, loginMethods, firebaseConfig } from "@lib/appconst"
import SystemAccountLoginPanel from "@scenes/accounts/Login/SystemAccountLoginPanel"
import PhoneLoginPanel from "@scenes/accounts/Login/PhoneLoginPanel"
import SocialLogin from "./SocialLogin/SocialLogin"
import { MailOutlined, PhoneOutlined } from "@ant-design/icons"

declare let abp: any

export interface ILoginProps {
  authenticationStore?: AuthenticationStore
  sessionStore?: SessionStore
  accountStore?: AccountStore
  history: any
  location: any
  form: any
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Login extends React.Component<ILoginProps> {
  state = {
    step: loginSteps.login,
    method: 1,
    loginMethodsAllow: {
      allowSelfRegistration: false,
      isAppleAuthenticatorEnabled: false,
      isEmailProviderEnabled: true,
      isGoogleAuthenticatorEnabled: false,
      isMicrosoftAuthenticatorEnabled: false,
      isSmsProviderEnabled: false,
      useCaptchaOnRegistration: false,
    },
  }

  async componentDidMount() {
    console.log("ss")
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    auth.languageCode = "vi"

    const res = await this.props.authenticationStore!.getMethod()
    this.setState({ loginMethodsAllow: res.twoFactorLogin })
  }

  handleSubmit = async (values: any) => {
    const { loginModel } = this.props.authenticationStore!
    if (values) {
      await this.props.authenticationStore!.login(values)
      sessionStorage.setItem("rememberMe", loginModel.rememberMe ? "1" : "0")
      const { state } = this.props.location
      window.location =
        state && state.from.pathname !== "/" ? state.from.pathname : "/"
    }
  }

  public render() {
    const { method, loginMethodsAllow } = this.state
    const currentYear = new Date().getFullYear()

    return (
      <Row className="page-login">
        <Col xs={0} md={16} className="h-100 col-right">
          <span className="footer-copy-right">
            {L("COPY_RIGHT_{0}", currentYear)}
          </span>
        </Col>
        <Col xs={24} md={8} className="h-100 col-left">
          <Card bordered={false} className="h-100 pt-3">
            <div style={{ textAlign: "center" }}>
              <img src="/assets/images/logo.png" />
              <br />
              <img src="../../../assets/images/auth/union.png" />
              <p className="mt-3 welcome-message">{L("WELCOME_MESSAGE")}</p>
            </div>
            <div className="text-center w-100">
              <div style={{ maxWidth: "360px", margin: "auto" }}>
                {method === null && (
                  <>
                    <SocialLogin
                      authenticationStore={this.props.authenticationStore}
                      loginMethodsAllow={loginMethodsAllow}
                    />
                    {loginMethodsAllow.isSmsProviderEnabled && (
                      <Button
                        className="w-100 my-1 text-left"
                        shape="round"
                        icon={<PhoneOutlined className="mx-3" />}
                        onClick={() =>
                          this.setState({ method: loginMethods.phoneNumber })
                        }
                      >
                        {L("LOGIN_METHOD_PHONE")}
                      </Button>
                    )}
                    {loginMethodsAllow.isEmailProviderEnabled && (
                      <Button
                        className="w-100 my-1 text-left"
                        shape="round"
                        onClick={() =>
                          this.setState({ method: loginMethods.systemAccount })
                        }
                        icon={<MailOutlined className="mx-3" />}
                      >
                        {L("LOGIN_METHOD_NORMAL")}
                      </Button>
                    )}
                  </>
                )}
                {method === loginMethods.phoneNumber && (
                  <PhoneLoginPanel
                    authenticationStore={this.props.authenticationStore}
                    history={this.props.history}
                    location={this.props.location}
                    handleBack={() => this.setState({ method: null })}
                  />
                )}
                {method === loginMethods.systemAccount && (
                  <>
                    {loginMethodsAllow.isEmailProviderEnabled && (
                      <SystemAccountLoginPanel
                        history={this.props.history}
                        location={this.props.location}
                        authenticationStore={this.props.authenticationStore}
                        handleBack={() => this.setState({ method: null })}
                      />
                    )}
                  </>
                )}

                <Row className="mb-3">
                  <Col span={24} style={{ textAlign: "center" }}>
                    <img
                      src="../../../assets/images/auth/union.png"
                      style={{ opacity: ".5" }}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    )
  }
}

export default Login
