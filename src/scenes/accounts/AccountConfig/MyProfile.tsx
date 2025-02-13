import * as React from "react"
import { Button, Card, Col, Divider, Form, Input, Row } from "antd"
import { MailOutlined, PhoneOutlined } from "@ant-design/icons"
import { L } from "@lib/abpUtility"
import rules, { ruleChangePassword } from "./validation"
import { useEffect } from "react"
import SessionStore from "@stores/sessionStore"
import AppConsts, { moduleAvatar } from "@lib/appconst"
import AvatarUpload from "@components/FileUpload/AvatarUpload"
import { inject } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { observer } from "mobx-react-lite"
import ModalChangePhoneNumber from "./components/ModalChangePhoneNumber"
import withRouter from "@components/Layout/Router/withRouter"
import userService from "@services/administrator/user/userService"
import { validateMessages } from "@lib/validation"
const { formVerticalLayout } = AppConsts
interface Props {
  sessionStore: SessionStore;
}

const MyProfile = inject(Stores.SessionStore)(
  observer((props: Props) => {
    const [changePhoneVisible, setChangePhoneVisible] = React.useState(false)
    const [form] = Form.useForm()
    const [formPassword] = Form.useForm()

    useEffect(() => {
      const formValues = {
        ...props.sessionStore?.currentLogin?.user,
      }
      form.setFieldsValue(formValues)
    }, [])

    const saveProfile = async () => {
      await form
        .validateFields()
        .then(() => {
          const data = form.getFieldsValue()
          props.sessionStore?.updateMyProfile(data)
        })
        .catch((errors) => {
          console.log(errors)
        })
    }

    const savePassword = async () => {
      await formPassword
        .validateFields()
        .then(() => {
          const data = formPassword.getFieldsValue()

          userService.changeMyPassword(data)
          formPassword.resetFields()
        })
        .catch((errors) => {
          // Errors in the fields
        })
    }
    const compareToFirstPassword = (rule: any, value: any, callback: any) => {
      if (value && value !== formPassword.getFieldValue("newPassword")) {
        callback("Two passwords that you enter is inconsistent!")
      } else {
        callback()
      }
    }
    const handleUpdateUsername = async (values) => {
      await props.sessionStore.updateUsername(values)
    }

    return (
      <Card style={{ padding: 12, borderRadius: 12 }}>
        <Form
          form={form}
          layout={"vertical"}
          validateMessages={validateMessages}
          initialValues={props.sessionStore?.currentLogin?.user}
          size="middle"
        >
          <Row gutter={[8, 0]}>
            <Col sm={{ span: 24, offset: 0 }}>
              <AvatarUpload
                module={moduleAvatar.myProfile}
                uploadClass="avatar-wrapper"
                sessionStore={props.sessionStore}
              ></AvatarUpload>
            </Col>

            <Col sm={{ span: 24, offset: 0 }}>
              <Form.Item
                label={L("MY_PROFILE_DISPLAY_NAME")}
                {...formVerticalLayout}
                name="displayName"
                rules={rules.displayName}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col sm={{ span: 12, offset: 0 }}>
              <Form.Item
                label={L("MY_PROFILE_EMAIL")}
                {...formVerticalLayout}
                name="emailAddress"
                rules={rules.emailAddress}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
            </Col>
            <Col sm={{ span: 12, offset: 0 }}>
              <Form.Item
                label={L("PHONE_NUMBER")}
                {...formVerticalLayout}
                name="phoneNumber"
                rules={rules.phoneNumber}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
          </Row>
          <Col style={{ textAlign: "right" }} sm={{ span: 24, offset: 0 }}>
            <Button
              onClick={() => saveProfile()}
              type="primary"
              style={{ marginRight: 5 }}
            >
              {L("BTN_SAVE_PROFILE")}
            </Button>
          </Col>
        </Form>
        <Divider
          orientation="left"
          orientationMargin="0"
          style={{ fontWeight: 600 }}
        >
          {L("CHANGE_MY_PASSWORD")}
        </Divider>
        <Form
          form={formPassword}
          validateMessages={validateMessages}
          layout={"vertical"}
          initialValues={props.sessionStore?.currentLogin?.user}
          size="middle"
        >
          <Col sm={{ span: 24, offset: 0 }}>
            <Form.Item
              label={L("MY_PROFILE_CURRENT_PASSWORD")}
              {...formVerticalLayout}
              name="currentPassword"
              rules={rules.password}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col sm={{ span: 24, offset: 0 }}>
            <Form.Item
              label={L("MY_PROFILE_NEW_PASSWORD")}
              {...formVerticalLayout}
              name="newPassword"
              rules={ruleChangePassword.newPassword}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col sm={{ span: 24, offset: 0 }}>
            <Form.Item
              label={L("ConfirmPassword")}
              {...formVerticalLayout}
              name="confirm"
              rules={[
                {
                  required: true,
                  message: L("ConfirmPassword"),
                },
                {
                  validator: compareToFirstPassword,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>

          <Col style={{ textAlign: "right" }} sm={{ span: 24, offset: 0 }}>
            <Button
              style={{ marginRight: 5 }}
              onClick={() => savePassword()}
              type="primary"
            >
              {L("BTN_SAVE_PASSWORD")}
            </Button>
            <Button
              style={{ marginRight: 5 }}
              onClick={async () => {
                await props.sessionStore.logout()
              }}
              type="default"
            >
              {L("BTN_LOGOUT")}
            </Button>
          </Col>
        </Form>
        <ModalChangePhoneNumber
          handleChangeUsername={(values) => handleUpdateUsername(values)}
          visible={changePhoneVisible}
          handleClose={() => setChangePhoneVisible(false)}
          phoneNumberAsUserName={
            props.sessionStore?.currentLogin?.user.userName
          }
        />
      </Card>
    )
  })
)

export default withRouter(MyProfile)
