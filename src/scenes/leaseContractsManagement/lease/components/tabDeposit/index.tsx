import React from "react"
// import TextArea from "antd/lib/input/TextArea";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { inject, observer } from "mobx-react"
import { Card, Col, Form, InputNumber, Row, Tabs } from "antd"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"

import _ from "lodash"
import { validateMessages } from "@lib/validation"
import { L } from "@lib/abpUtility"
import { inputCurrencyFormatter } from "@lib/helper"
import TabPane from "antd/lib/tabs/TabPane"
import DepositInformation from "./components/depositInformation"
import DepositCollected from "./components/depositCollected"
import DepositRefund from "./components/depositRefund"
import DepositStore from "@stores/activity/depositStore"
interface Props {
  leaseAgreementStore: LeaseAgreementStore
  leaseAgreementId: any
  thisTabKey: any
  parentTabKeyChoose: any
  depositStore: DepositStore
}
interface States {
  tabActiveKey: any
}
const tabKeys = {
  tabDepositInfo: "DEPOSIT_INFO",
  tabDepositCollect: "DEPOSIT_COLLECT",
  tabDepositRefund: "DEPOSIT_REFUND",
}
@inject(Stores.LeaseAgreementStore, Stores.DepositStore)
@observer
class Deposit extends AppComponentListBase<Props, States> {
  formRef = React.createRef<any>()
  constructor(props) {
    super(props)
    this.state = {
      tabActiveKey: tabKeys.tabDepositInfo,
    }
  }
  async componentDidMount() {
    this.initData()
  }
  componentDidUpdate = async (prevProps: any) => {
    if (this.props.parentTabKeyChoose !== prevProps.parentTabKeyChoose) {
      if (this.props.parentTabKeyChoose === this.props.thisTabKey) {
        this.initData()
      }
    }
  }

  initData = async () => {
    await this.props.depositStore.getDashboardDeposit(
      this.props.leaseAgreementId
    )

    await this.formRef.current?.setFieldsValue(
      this.props.depositStore.dashboardDeposit
    )
  }

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  render(): React.ReactNode {
    return (
      <>
        <Form
          ref={this.formRef}
          layout={"vertical"}
          validateMessages={validateMessages}
          size="middle"
        >
          <Card bordered={false} className="card-detail-modal">
            <Row gutter={[8, 16]}>
              <Col sm={{ span: 6 }}>
                <Form.Item label={L("TOTAL_DEPOSIT")} name="totalDeposit">
                  <InputNumber
                    min={0}
                    className="w-100"
                    formatter={(value) => inputCurrencyFormatter(value)}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 6 }}>
                <Form.Item label={L("COLLECTED")} name="totalCollected">
                  <InputNumber
                    min={0}
                    className="w-100"
                    formatter={(value) => inputCurrencyFormatter(value)}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 6 }}>
                <Form.Item
                  label={L("TO_BE_COLLECTED")}
                  name="totalToBeCollected"
                >
                  <InputNumber
                    min={0}
                    className="w-100 form-item-highlight-red"
                    formatter={(value) => inputCurrencyFormatter(value)}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 6 }}>
                <Form.Item label={L("REFUNDED")} name="totalRefund">
                  <InputNumber
                    min={0}
                    className="w-100"
                    formatter={(value) => inputCurrencyFormatter(value)}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Row gutter={[8, 8]}>
                  <Col sm={{ span: 24 }}>
                    <Tabs
                      activeKey={this.state.tabActiveKey}
                      onTabClick={this.changeTab}
                      className={"antd-tab-detail"}
                      type="card"
                    >
                      <TabPane
                        tab={L(tabKeys.tabDepositInfo)}
                        key={tabKeys.tabDepositInfo}
                      >
                        <DepositInformation
                          leaseAgreementId={this.props.leaseAgreementId}
                          selectItem={this.state.tabActiveKey}
                          tabKey={tabKeys.tabDepositInfo}
                          dataChange={this.initData}
                        />
                      </TabPane>
                      <TabPane
                        tab={L(tabKeys.tabDepositCollect)}
                        key={tabKeys.tabDepositCollect}
                      >
                        <DepositCollected
                          leaseAgreementId={this.props.leaseAgreementId}
                          selectItem={this.state.tabActiveKey}
                          tabKey={tabKeys.tabDepositCollect}
                          dataChange={this.initData}
                        />
                      </TabPane>
                      <TabPane
                        tab={L(tabKeys.tabDepositRefund)}
                        key={tabKeys.tabDepositRefund}
                      >
                        <DepositRefund
                          leaseAgreementId={this.props.leaseAgreementId}
                          selectItem={this.state.tabActiveKey}
                          tabKey={tabKeys.tabDepositRefund}
                          dataChange={this.initData}
                        />
                      </TabPane>
                    </Tabs>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Form>
      </>
    )
  }
}
export default withRouter(Deposit)
