import * as React from 'react'

import { Col, Form, Input, Modal, Row } from 'antd'
import { MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { L } from '@lib/abpUtility'
import rules from './validation'
import AppConsts, { moduleAvatar } from '../../../../../lib/appconst'
import AvatarUpload from '../../../../FileUpload/AvatarUpload'
import SessionStore from '../../../../../stores/sessionStore'
import { useEffect, useState } from 'react'
const { formVerticalLayout } = AppConsts

export interface IMyProfileProps {
  sessionStore?: SessionStore
  visible: boolean
  onCancel: () => void
  formRef: any
}

const MyProfileFormModal: React.FC<IMyProfileProps> = ({ sessionStore, visible, onCancel }) => {
  const [form] = Form.useForm()
  // const [displayNames, setDisplayName] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible && form) {
      form.setFieldsValue(sessionStore?.currentLogin?.user)
    }
  }, [visible])

  // const buildDisplayName = () => {
  //   let name = form.getFieldValue('name') || ''
  //   let surname = form.getFieldValue('surname') || ''
  //   if (name.length && surname.length) {
  //     name = name.trim()
  //     surname = surname.trim()
  //     setDisplayName([`${name} ${surname}`, `${surname} ${name}`] as any)
  //   }
  // }

  const onUpdate = () => {
    form.validateFields().then(async (values: any) => {
      setLoading(true)
      await sessionStore
        ?.updateMyProfile({
          ...values
        })
        .finally(() => setLoading(false))

      onCancel()
    })
  }
  return (
    <Modal
      visible={visible}
      cancelText={L('BTN_CANCEL')}
      okText={L('BTN_SAVE')}
      onCancel={onCancel}
      onOk={onUpdate}
      title={L('MY_PROFILE_TILE')}
      confirmLoading={loading}
    >
      <Form form={form} layout={'vertical'} initialValues={sessionStore?.currentLogin?.user} size="large">
        <Row gutter={[16, 0]}>
          <Col sm={{ span: 24, offset: 0 }} className="mb-3">
            <AvatarUpload
              module={moduleAvatar.myProfile}
              uploadClass="avatar-wrapper"
              sessionStore={sessionStore}
            ></AvatarUpload>
          </Col>
          {/* <Col sm={{ span: 12, offset: 0 }}>
            <Form.Item label={L('MY_PROFILE_SURNAME')} {...formVerticalLayout} name="surname" rules={rules.surname}>
              <Input onChange={buildDisplayName} />
            </Form.Item>
          </Col>
          <Col sm={{ span: 12, offset: 0 }}>
            <Form.Item label={L('MY_PROFILE_NAME')} {...formVerticalLayout} name="name" rules={rules.name}>
              <Input onChange={buildDisplayName} />
            </Form.Item>
          </Col> */}
          <Col sm={{ span: 24, offset: 0 }}>
            <Form.Item
              label={L('MY_PROFILE_FULL_NAME')}
              {...formVerticalLayout}
              name="displayName"
              rules={rules.displayName}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={{ span: 24, offset: 0 }}>
            <Form.Item
              label={L('MY_PROFILE_PHONE_NUMBER')}
              {...formVerticalLayout}
              name="phoneNumber"
              rules={rules.phoneNumber}
            >
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
          </Col>
          <Col sm={{ span: 24, offset: 0 }}>
            <Form.Item
              label={L('MY_PROFILE_EMAIL')}
              {...formVerticalLayout}
              name="emailAddress"
              rules={rules.emailAddress}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default MyProfileFormModal
