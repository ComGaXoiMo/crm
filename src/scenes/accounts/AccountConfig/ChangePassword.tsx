import { Row, Form, Col, Input, Button, Spin } from "antd"
import React from "react"
import { LockOutlined } from "@ant-design/icons"
import { ruleChangePassword } from "./validation"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import WrapPageScroll from "@components/WrapPageScroll"
import accountServices from "../../../services/account/accountService"

const { formVerticalLayout } = AppConsts
interface Props {
  id?: any
}

const ChangePassword = (props: Props) => {
  const [formForgotPassword] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [errorContent, setErrorContent] = React.useState(<Spin />)
  React.useEffect(() => {
    setLoading(true)
    if (
      abp.setting.values[
        "App.UserManagement.TwoFactorLogin.IsEmailProviderEnabled"
      ] === "true"
    ) {
      setLoading(false)
    } else {
      setErrorContent(
        <div className="w-100 text-center">{L("NOT_SUPPORT_PASSWORD")}</div>
      )
    }
  }, [])

  const handleChangePassword = () => {
    formForgotPassword.validateFields().then(async (values: any) => {
      setLoading(true)
      await accountServices
        .changePassword(values)
        .finally(() => setLoading(false))
      formForgotPassword.resetFields()
    })
  }
  const renderActions = (loading?) => {
    return (
      <Button
        type="primary"
        onClick={() => handleChangePassword()}
        loading={loading}
        shape="round"
      >
        {L("BTN_SAVE")}
      </Button>
    )
  }
  return (
    <WrapPageScroll renderActions={() => renderActions(loading)}>
      <Form form={formForgotPassword} layout={"vertical"} size="large">
        {loading ? (
          <>{errorContent}</>
        ) : (
          <Row gutter={[8, 8]}>
            <Col sm={{ span: 24, offset: 0 }}>
              <Form.Item
                label={L("CHANGE_PASSWORD_PASSWORD")}
                {...formVerticalLayout}
                name="currentPassword"
                rules={ruleChangePassword.currentPassword}
              >
                <Input
                  type="password"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 12, offset: 0 }}>
              <Form.Item
                label={L("CHANGE_PASSWORD_NEW_PASSWORD")}
                {...formVerticalLayout}
                name="newPassword"
                rules={ruleChangePassword.newPassword}
              >
                <Input
                  type="password"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 12, offset: 0 }}>
              <Form.Item
                label={L("CHANGE_PASSWORD_NEW_PASSWORD_RETYPE")}
                {...formVerticalLayout}
                name="newPasswordReType"
                rules={ruleChangePassword.newPasswordReType}
              >
                <Input
                  type="password"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 12, offset: 0 }}>
              <div className="text-muted"> • {L("ATLEAST_8_CHARACTER")}</div>
              <div className="text-muted">
                &nbsp; • {L("MUST_HAVE_UPPERCASE_AND_LOWERCASE_LETTER")}
              </div>
              <div className="text-muted"> • {L("MUST_HAVE_NUMBERIC")}</div>
            </Col>
          </Row>
        )}
      </Form>
    </WrapPageScroll>
  )
}

export default ChangePassword
