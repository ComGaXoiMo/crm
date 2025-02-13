import React, { useEffect, useState } from 'react'
import { Form, Modal, Row, Col } from 'antd'
import { L, isGrantedAny } from '@lib/abpUtility'
import { appPermissions } from '@lib/appconst'
import { validateMessages } from '@lib/validation'
import rules from './validation'
import FormInput from '@components/FormItem/FormInput'
import FormNumber from '@components/FormItem/FormNumber'
import FormTextArea from '@components/FormItem/FormTextArea'
import FormSwitch from '@components/FormItem/FormSwitch'
import FormInputMultiLanguage from '@components/FormItem/FormInputMultiLanguage'

const RatingBadgeModal = ({ visible, data, handleOK, handleCancel, ratingBadgeStore }) => {
  const [form] = Form.useForm()
  const [initialValues, setInitialValues] = useState({})

  useEffect(() => {
    if (data) {
      setInitialValues(data)
      form.setFieldsValue(data)
    }
  }, [data])

  const onOk = async () => {
    return form.validateFields().then(async () => {
      const dataForm = form.getFieldsValue() || {}
      if (data.id) {
        await ratingBadgeStore.update({ ...data, ...dataForm })
      } else {
        await ratingBadgeStore.create({ ...data, ...dataForm })
      }

      await handleOK()
      handleCancel()
      form.resetFields()
    })
  }

  const onCancel = async () => {
    form.resetFields()
    handleCancel()
  }

  return (
    <>
      <Modal
        title={L('RATING_BADGE_FORM_TITLE')}
        visible={visible}
        okText={L('BTN_SAVE')}
        onOk={onOk}
        cancelText={L('BTN_CANCEL')}
        onCancel={onCancel}
        confirmLoading={ratingBadgeStore.isLoading}
        destroyOnClose
        maskClosable={false}
        okButtonProps={{
          disabled: !isGrantedAny(appPermissions.ratingBadge.create, appPermissions.ratingBadge.update),
          className: !isGrantedAny(appPermissions.ratingBadge.create, appPermissions.ratingBadge.update) ? 'd-none' : ''
        }}
        forceRender
      >
        <Form
          layout="vertical"
          initialValues={initialValues}
          form={form}
          validateMessages={validateMessages}
          size="large"
        >
          <Row gutter={16}>
            <Col sm={{ span: 24 }}>
              <FormInputMultiLanguage label="RATING_BADGE_NAME" name="names" rule={rules.names} />
            </Col>
            <Col md={{ span: 12 }}>
              <FormInput label="RATING_BADGE_CODE" name="code" rule={rules.code} />
            </Col>
            <Col md={{ span: 12 }}>
              <FormNumber label="SORT_ORDER" name="sortNumber" rule={rules.sortNumber} min={0} />
            </Col>
            <Col md={{ span: 24 }}>
              <FormTextArea label="DESCRIPTION" name="description" rule={rules.description} />
            </Col>
            <Col sm={{ span: 24, offset: 0 }}>
              <FormSwitch label="ACTIVE_STATUS" name="isActive" />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default RatingBadgeModal
