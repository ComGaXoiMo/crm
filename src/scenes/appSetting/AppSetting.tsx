import React from "react"
import {
  Button,
  Tabs,
  Form,
  Col,
  Row,
  Checkbox,
  Select,
  Switch,
  InputNumber,
} from "antd"
import WrapPageScroll from "@components/WrapPageScroll"
import { inject } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { observer } from "mobx-react-lite"
import SessionStore from "@stores/sessionStore"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import LoginSocial from "./components/loginSocial"
import LoginPhone from "./components/loginPhone"
import LoginManual from "./components/loginManual"
import { notifySuccess } from "@lib/helper"
const { formVerticalLayout } = AppConsts

const { TabPane } = Tabs
interface Props {
  sessionStore: SessionStore
}

const AppSetting = inject(Stores.SessionStore)(
  observer((props: Props) => {
    const [formAppSetting] = Form.useForm()
    const [isEmailProviderEnabled, setIsEmailProviderEnabled] =
      React.useState(false)
    const [isSmsProviderEnabled, setIsSmsProviderEnabled] =
      React.useState(false)
    const [socialLogin, setSocialLogin] = React.useState(false)
    const [passwordComplexity, setPasswordComplexity] = React.useState({
      requireDigit: true,
      requireLowercase: true,
      requireNonAlphanumeric: true,
      requireUppercase: true,
      requiredLength: 8,
    })
    const [userLockOut, setUserLockOut] = React.useState({
      isEnabled: true,
      maxFailedAccessAttemptsBeforeLockout: 60,
      defaultAccountLockoutSeconds: 100,
    })
    React.useEffect(() => {
      props.sessionStore.getHostSetting().then((values) => {
        setIsEmailProviderEnabled(
          values.security.twoFactorLogin.isEmailProviderEnabled
        )
        setIsSmsProviderEnabled(
          values.security.twoFactorLogin.isSmsProviderEnabled
        )
        setSocialLogin(
          values.security.twoFactorLogin.isGoogleAuthenticatorEnabled
        )
        setPasswordComplexity(values.security.passwordComplexity)
        setUserLockOut(values.security.userLockOut)
        formAppSetting.setFieldsValue(values)
      })
    }, [])

    const handleSubmit = async () => {
      const values = await formAppSetting.validateFields()

      values.security.twoFactorLogin = {
        isEmailProviderEnabled: isEmailProviderEnabled,
        isSmsProviderEnabled: isSmsProviderEnabled,
        isGoogleAuthenticatorEnabled: socialLogin,
        isAppleAuthenticatorEnabled: socialLogin,
        isMicrosoftAuthenticatorEnabled: socialLogin,
      }
      values.security.passwordComplexity = passwordComplexity
      values.security.userLockOut = userLockOut
      values.security.defaultPasswordComplexity =
        props.sessionStore.hostSetting.security.defaultPasswordComplexity
      await props.sessionStore.changeHostSetting(values)
      notifySuccess(L("SUCCESSFULLY"), L("UPDATE_SETTING_SUCCESSFULLY"))
    }
    const renderActions = (loading?) => {
      return (
        <>
          <Button type="primary" shape="round" onClick={() => handleSubmit()}>
            {L("BTN_SAVE")}
          </Button>
        </>
      )
    }
    return (
      <WrapPageScroll closeCollapse renderActions={() => renderActions(false)}>
        <Form form={formAppSetting} layout="vertical">
          <Tabs defaultActiveKey="1">
            <TabPane tab={L("GENERAL")} key="1">
              <Row gutter={[8, 8]} className="mx-3">
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    {...formVerticalLayout}
                    name={["general", "startDayOfWeek"]}
                    label={L("START_DAY_OF_WEEK")}
                  >
                    <Select showArrow>
                      {AppConsts.dayOfWeek.map((option, index) => (
                        <Select.Option key={index} value={option.value}>
                          {L(option.name)}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 12, offset: 0 }} />
                <Col sm={{ span: 24, offset: 0 }}>
                  <strong>{L("CONFIG_SENDER")}</strong>
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    name={["general", "allowSendEmail"]}
                    valuePropName="checked"
                  >
                    <Checkbox>{L("ALLOW_SEND_EMAIL")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    name={["general", "allowSendSms"]}
                    valuePropName="checked"
                  >
                    <Checkbox>{L("ALLOW_SEND_SMS")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <strong>{L("PAYMENT_METHOD")}</strong>
                </Col>

                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    name={["general", "momoEnable"]}
                    valuePropName="checked"
                  >
                    <Checkbox>{L("MOMO_ENABLE")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    name={["general", "vnPayEnable"]}
                    valuePropName="checked"
                  >
                    <Checkbox>{L("VNPAY_ENABLE")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    name={["general", "zaloPayEnable"]}
                    valuePropName="checked"
                  >
                    <Checkbox>{L("ZALOPAY_ENABLE")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <strong>{L("USER_MANAGEMENT")}</strong>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Form.Item
                    name={["userManagement", "allowSelfRegistration"]}
                    valuePropName="checked"
                  >
                    <Checkbox>{L("ALLOW_SELF_REGISTRATION")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Form.Item
                    name={["userManagement", "smsVerificationEnabled"]}
                    valuePropName="checked"
                  >
                    <Checkbox>{L("SMS_VERIFICATION_ENABLE")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Form.Item
                    name={["userManagement", "useCaptchaOnRegistration"]}
                    valuePropName="checked"
                  >
                    <Checkbox>{L("USE_CAPCHA_REGISTRATION")}</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={L("SERCURITY")} key="3">
              <Row gutter={[8, 8]} className="mx-3">
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    name={["security", "allowOneConcurrentLoginPerUser"]}
                    valuePropName="checked"
                  >
                    <Checkbox>{L("ALLOW_ONE_CURRENT_LOGIN_PER_USER")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <Form.Item
                    name={["security", "useDefaultPasswordComplexitySettings"]}
                    valuePropName="checked"
                  >
                    <Checkbox>{L("USE_DEFAULT_PASSWORD_CEMPLEXITY")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <strong>{L("CONFIG_LOGIN_METHOD")}</strong>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Switch
                    className="mr-1"
                    defaultChecked={socialLogin}
                    onChange={setSocialLogin}
                  />
                  <label style={{ display: "inline" }}>
                    {L("ALLOW_LOGIN_SOCIAL")}
                  </label>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <div style={{ maxWidth: 320, marginLeft: 40 }}>
                    <LoginSocial />
                  </div>
                </Col>

                <Col sm={{ span: 24, offset: 0 }}>
                  <Switch
                    className="mr-1"
                    defaultChecked={isSmsProviderEnabled}
                    onChange={setIsSmsProviderEnabled}
                  />
                  <label style={{ display: "inline" }}>
                    {L("ALLOW_LOGIN_PHONE")}
                  </label>
                </Col>
                <Col sm={{ span: 24, offset: 0 }} className="w-100">
                  <div style={{ maxWidth: 320, marginLeft: 40 }}>
                    <LoginPhone />
                  </div>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Switch
                    className="mr-1"
                    defaultChecked={isEmailProviderEnabled}
                    onChange={setIsEmailProviderEnabled}
                  />
                  <label style={{ display: "inline" }}>
                    {L("ALLOW_LOGIN_MANUAL")}
                  </label>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <div style={{ maxWidth: 320, marginLeft: 40 }}>
                    <LoginManual />
                  </div>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <strong>{L("PASSWORD_COMPLEXITY")}</strong>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Checkbox
                    defaultChecked={passwordComplexity.requireDigit}
                    onChange={(e) => {
                      const res = passwordComplexity
                      res.requireDigit = e.target.checked
                      setPasswordComplexity(res)
                    }}
                  >
                    {L("REQUIRED_DIGIT")}
                  </Checkbox>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Checkbox
                    defaultChecked={passwordComplexity.requireLowercase}
                    onChange={(e) => {
                      const res = passwordComplexity
                      res.requireLowercase = e.target.checked
                      setPasswordComplexity(res)
                    }}
                  >
                    {L("REQUIRED_LOWERCASE")}
                  </Checkbox>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Checkbox
                    defaultChecked={passwordComplexity.requireUppercase}
                    onChange={(e) => {
                      const res = passwordComplexity
                      res.requireUppercase = e.target.checked
                      setPasswordComplexity(res)
                    }}
                  >
                    {L("REQUIRED_UPPERCASE")}
                  </Checkbox>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Checkbox
                    defaultChecked={passwordComplexity.requireNonAlphanumeric}
                    onChange={(e) => {
                      const res = passwordComplexity
                      res.requireNonAlphanumeric = e.target.checked
                      setPasswordComplexity(res)
                    }}
                  >
                    {L("REQUIRED_NON_ALPHA_NUMERIC")}
                  </Checkbox>
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <label>{L("REQUIRED_LENGTH")}</label>
                  <InputNumber
                    className="w-100"
                    defaultValue={passwordComplexity.requiredLength}
                    onChange={(e) => {
                      const res = passwordComplexity
                      res.requiredLength = e || 0
                      setPasswordComplexity(res)
                    }}
                  />
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <strong>{L("USER_LOCK_OUT")}</strong>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Checkbox
                    defaultChecked={userLockOut.isEnabled}
                    onChange={(e) => {
                      const res = userLockOut
                      res.isEnabled = e.target.checked
                      setUserLockOut(res)
                    }}
                  >
                    {L("ENABLE_LOCK_ACCOUNT_ON_FAIL_LOGIN")}
                  </Checkbox>
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <label>{L("NUMBER_OF_FAILED")}</label>
                  <InputNumber
                    className="w-100"
                    defaultValue={
                      userLockOut.maxFailedAccessAttemptsBeforeLockout
                    }
                    onChange={(e) => {
                      const res = userLockOut
                      res.maxFailedAccessAttemptsBeforeLockout = e || 0
                      setUserLockOut(res)
                    }}
                  />
                </Col>
                <Col sm={{ span: 12, offset: 0 }}>
                  <label>{L("LOCKING_DURATION")}</label>
                  <InputNumber
                    className="w-100"
                    defaultValue={userLockOut.defaultAccountLockoutSeconds}
                    onChange={(e) => {
                      const res = userLockOut
                      res.defaultAccountLockoutSeconds = e || 0
                      setUserLockOut(res)
                    }}
                  />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Form>
        <style>{`
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          font-weight: 600 !important;
          border-radius: 16px !important;
          padding: 2px 24px 2px 24px !important;
          background-color: rgba(211, 164, 41, 0.12) !important;
        }
        `}</style>
      </WrapPageScroll>
    )
  })
)

export default AppSetting
