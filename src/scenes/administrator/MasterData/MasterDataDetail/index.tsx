import * as React from 'react'

import { Button, Card, Col, Form, Input, Modal, Row, Select } from 'antd'
import AppComponentBase from '../../../../components/AppComponentBase'
import { L, LNotification } from '../../../../lib/abpUtility'
import MasterDataStore from '../../../../stores/administrator/masterDataStore'
import { inject, observer } from 'mobx-react'
import Stores from '../../../../stores/storeIdentifier'
import AppConsts from '../../../../lib/appconst'
import WrapPageScroll from '../../../../components/WrapPageScroll'
import rules from '../components/validation'
import { validateMessages } from '../../../../lib/validation'
import MultiLanguageInput from '@components/Inputs/MultiLanguageInput'

const { formVerticalLayout } = AppConsts

export interface IMasterDatasProps {
  match: any
  history: any
  masterDataStore: MasterDataStore
}

export interface IMasterDatasState {
  isDirty: boolean
}

const confirm = Modal.confirm

@inject(Stores.MasterDataStore)
@observer
class MasterDataDetail extends AppComponentBase<IMasterDatasProps, IMasterDatasState> {
  formRef: any = React.createRef()
  state = {
    isDirty: false
  }

  async componentDidMount() {
    await Promise.all([this.getDetail(this.props.match?.params?.id)])
  }

  async getDetail(id) {
    if (!id) {
      await this.props.masterDataStore.createMasterData()
    } else {
      await this.props.masterDataStore.get(id)
    }
    this.formRef.current.setFieldsValue({ ...this.props.masterDataStore.editMasterData })
  }

  onSave = () => {
    const form = this.formRef.current

    form.validateFields().then(async (values: any) => {
      if (this.props.masterDataStore.editMasterData?.id) {
        await this.props.masterDataStore.update({
          ...this.props.masterDataStore.editMasterData,
          ...values
        })
      } else {
        await this.props.masterDataStore.create(values)
      }
      form.resetFields()
      this.props.history.goBack()
    })
  }

  onCancel = () => {
    if (this.state.isDirty) {
      confirm({
        title: LNotification('ARE_YOU_SURE'),
        okText: L('BTN_YES'),
        cancelText: L('BTN_NO'),
        onOk: () => {
          this.props.history.goBack()
        }
      })
      return
    }
    this.props.history.goBack()
  }

  renderActions = (isLoading?) => {
    return (
      <Row>
        <Col sm={{ span: 24, offset: 0 }}>
          <Button className="mr-1" onClick={this.onCancel} shape="round">
            {L('BTN_CANCEL')}
          </Button>
        </Col>
      </Row>
    )
  }

  public render() {
    const {
      masterDataStore: { targetOptions, isLoading }
    } = this.props

    return (
      <WrapPageScroll renderActions={() => this.renderActions(isLoading)}>
        <Card>
          <Form ref={this.formRef} layout={'vertical'} validateMessages={validateMessages} size="large">
            <Row gutter={[16, 0]}>
              <Col sm={{ span: 8, offset: 0 }}>
                <Form.Item label={L('TARGET')} {...formVerticalLayout} name="target">
                  <Select className="full-width">{this.renderOptions(targetOptions)}</Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 8, offset: 0 }}>
                <Form.Item label={L('CODE')} {...formVerticalLayout} name="code" rules={rules.code}>
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={{ span: 8, offset: 0 }}>
                <Form.Item label={L('NAME')} {...formVerticalLayout} name="names" rules={rules.name}>
                  <MultiLanguageInput />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Form.Item label={L('DESCRIPTION')} {...formVerticalLayout} name="description">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </WrapPageScroll>
    )
  }
}

export default MasterDataDetail
