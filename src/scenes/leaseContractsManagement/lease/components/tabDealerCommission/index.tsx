import React from "react"
// import TextArea from "antd/lib/input/TextArea";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { inject, observer } from "mobx-react"
import { v4 as uuid } from "uuid"
import { Col, Row, Table } from "antd"
import totalColumn from "./components/totalColumns"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"

import CommissionPhaseDealer from "./components/commissionPhaseDealer"
import _ from "lodash"
interface Props {
  leaseAgreementStore: LeaseAgreementStore;
  leaseAgreementId: any;
  thisTabKey: any;
  parentTabKeyChoose: any;
}
interface States {
  commissionDataTable: any[];
}

@inject(Stores.LeaseAgreementStore)
@observer
class Commission extends AppComponentListBase<Props, States> {
  constructor(props) {
    super(props)
    this.state = {
      commissionDataTable: [] as any,
    }
  }
  async componentDidMount() {
    this.getLACommission()
    this.getTotalCommDealer()
  }
  componentDidUpdate = async (prevProps: any) => {
    if (this.props.parentTabKeyChoose !== prevProps.parentTabKeyChoose) {
      if (this.props.parentTabKeyChoose === this.props.thisTabKey) {
        this.getTotalCommDealer()
        this.getLACommission()
      }
    }
  };

  getTotalCommDealer = async () => {
    await this.props.leaseAgreementStore.getLACommissionDealer(
      this.props.leaseAgreementId
    )
  };

  getLACommission = async () => {
    await this.props.leaseAgreementStore.getLACommission(
      this.props.leaseAgreementId
    )
    if (this.props.leaseAgreementStore.lACommission?.id) {
      await this.getInitLACommDetail()
    }
  };
  getInitLACommDetail = () => {
    const commissionDataTable = [] as any

    for (const phase of this.props.leaseAgreementStore.lACommission
      ?.leaseAgreementCommissionPhase) {
      const { leaseAgreementCommissionDetails, ...phaseParent } = phase
      commissionDataTable.push({ ...phaseParent, isPhase: true, key: uuid() })
      for (const dealer of leaseAgreementCommissionDetails) {
        commissionDataTable.push({
          ...dealer,
          dealerName: dealer?.user?.displayName,
          key: uuid(),
        })
      }
    }

    this.setState({ commissionDataTable })
  };

  render(): React.ReactNode {
    const totalColumns = totalColumn()
    const {
      leaseAgreementStore: { isLoading },
    } = this.props
    return (
      <>
        <Row gutter={[8, 4]}>
          <Col sm={{ span: 12 }}>
            <Table
              size="middle"
              className="comm-table"
              rowKey={(record, index) => `dctt-${index}`}
              bordered
              loading={isLoading}
              columns={totalColumns}
              dataSource={this.props.leaseAgreementStore.lACommissionDealer}
              pagination={false}
            />
          </Col>
          <Col sm={{ span: 24 }}>
            <Row gutter={[8, 8]}>
              <Col sm={{ span: 24 }}>
                <CommissionPhaseDealer
                  dataTable={this.state.commissionDataTable}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    )
  }
}
export default withRouter(Commission)
