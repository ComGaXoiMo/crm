import React from "react"
// import TextArea from "antd/lib/input/TextArea";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { inject, observer } from "mobx-react"
import { Button, Col, Dropdown, Menu, Modal, Row, Table, Tooltip } from "antd"
import getColumn from "./components/columns"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"

import _ from "lodash"
import { L, LNotification } from "@lib/abpUtility"
import { appPermissions } from "@lib/appconst"
import ContactStore from "@stores/clientManagement/contactStore"
import { renderDotActive } from "@lib/helper"
import { MoreOutlined, PlusCircleFilled } from "@ant-design/icons"
import DataTable from "@components/DataTable"
import DetailModal from "./components/detailModal"
interface Props {
  leaseAgreementStore: LeaseAgreementStore
  leaseAgreementId: any
  thisTabKey: any
  contactStore: ContactStore
  parentTabKeyChoose: any
}
interface States {
  maxResultCount: number
  skipCount: number
  contactId: any
  modalVisible: boolean
}

@inject(Stores.LeaseAgreementStore, Stores.ContactStore)
@observer
class OtherContact extends AppComponentListBase<Props, States> {
  constructor(props) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      contactId: undefined,
      modalVisible: false,
    }
  }
  async componentDidMount() {
    this.getAll()
  }
  componentDidUpdate = async (prevProps: any) => {
    if (this.props.parentTabKeyChoose !== prevProps.parentTabKeyChoose) {
      if (this.props.parentTabKeyChoose === this.props.thisTabKey) {
        this.getAll()
      }
    }
  }
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getAll()
    )
  }

  getAll = async () => {
    await this.props.contactStore.getAllContactByLA({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      leaseAgreementId: this.props.leaseAgreementId,
    })
    await console.log(this.props.contactStore.listContactByLA)
  }
  gotoDetail = async (id?) => {
    if (id) {
      await this.props.contactStore.get(id, false)

      await this.setState({ contactId: id, modalVisible: true })
    } else {
      this.setState({ contactId: undefined, modalVisible: true })
    }
  }

  activateOrDeactivate = async (id: number, isActive) => {
    const self = this
    Modal.confirm({
      title: LNotification("DO_YOU_WANT_TO_DELETE_THIS_ITEM"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.contactStore.deleteLAContact(
          id,
          this.props.leaseAgreementId
        )
        self.handleTableChange({
          current: 1,
          pageSize: this.state.maxResultCount,
        })
      },
    })
  }
  render() {
    const columns = getColumn({
      title: L("CONTACT_NAME"),
      dataIndex: "contactName",
      key: "contactName",
      width: 150,
      ellipsis: false,
      render: (contactName: string, item: any) => (
        <Row>
          <Col
            sm={{ span: 20, offset: 0 }}
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            <a
              onClick={
                this.isGranted(appPermissions.contact.detail)
                  ? () => this.gotoDetail(item.id)
                  : () => console.log("no permission")
              }
              className="link-text-table"
            >
              {renderDotActive(item.isActive)} {contactName}
            </a>
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {this.isGranted(appPermissions.contact.delete) && (
                    <Menu.Item
                      key={1}
                      onClick={() =>
                        this.activateOrDeactivate(item.id, !item.isActive)
                      }
                    >
                      {L("BTN_DELETE")}
                    </Menu.Item>
                  )}
                </Menu>
              }
              placement="bottomLeft"
            >
              <button className="button-action-hiden-table-cell">
                <MoreOutlined />
              </button>
            </Dropdown>
          </Col>
        </Row>
      ),
    })
    const {
      contactStore: { listContactByLA, isLoading },
    } = this.props
    return (
      <>
        <Row gutter={[8, 4]}>
          <Col
            sm={{ span: 24 }}
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            {this.isGranted(appPermissions.contact.create) && (
              <Tooltip title={L("CREATE_CONTACT")} placement="topLeft">
                <Button
                  icon={<PlusCircleFilled />}
                  className="button-primary"
                  onClick={() => this.gotoDetail()}
                ></Button>
              </Tooltip>
            )}
          </Col>

          <Col sm={{ span: 24 }}>
            <DataTable
              pagination={{
                pageSize: this.state.maxResultCount,
                total:
                  listContactByLA === undefined
                    ? 0
                    : listContactByLA.totalCount,
                onChange: this.handleTableChange,
              }}
            >
              <Table
                size="middle"
                className="comm-table"
                rowKey={(record) => record.id}
                columns={columns}
                pagination={false}
                dataSource={
                  listContactByLA === undefined ? [] : listContactByLA?.items
                }
                loading={isLoading}
                bordered
              />
            </DataTable>
          </Col>
        </Row>
        <DetailModal
          leaseAgreementId={this.props.leaseAgreementId}
          id={this.state.contactId}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({ modalVisible: false })
          }}
          onOk={() => {
            this.getAll()
          }}
        />
      </>
    )
  }
}
export default withRouter(OtherContact)
