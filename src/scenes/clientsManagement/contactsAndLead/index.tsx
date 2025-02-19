import * as React from "react"

import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import gettColumns from "./components/contactsAndLeadColumn"
import { Col, Dropdown, Menu, Modal, Popover, Row, Table } from "antd"
import AppDataStore from "@stores/appDataStore"
import { L, LNotification } from "@lib/abpUtility"

import { MoreOutlined, TeamOutlined } from "@ant-design/icons/lib/icons"
import ContactsAndLeadFilterPanel from "./components/contactsAndLeadFilterPanel"
import ContactStore from "@stores/clientManagement/contactStore"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import ContractDetailModal from "./components/contractDetailModal"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, { appPermissions } from "@lib/appconst"
import { renderDotActive } from "@lib/helper"
import AsociatePartyModal from "./components/asociateParty/AsociatePartyModal"
const confirm = Modal.confirm
const { align } = AppConsts
export interface IContactProps {
  history: any
  location: any
  appDataStore: AppDataStore
  contactStore: ContactStore
}

export interface IContactState {
  maxResultCount: number
  skipCount: number
  filters: any
  modalVisible: boolean
  contactId: any
  aPVisible: boolean
  paramValue: any
  tagetName: string
}

@inject(Stores.ContactStore)
@inject(Stores.AppDataStore)
@observer
class ContactsAndLead extends AppComponentListBase<
  IContactProps,
  IContactState
> {
  formRef: any = React.createRef()

  state = {
    maxResultCount: 10,
    skipCount: 0,
    filters: {
      isActive: true,
    },
    modalVisible: false,
    aPVisible: false,
    contactId: undefined,
    paramValue: {} as any,
    tagetName: "",
  }

  async componentDidMount() {
    await this.checkParamValue()
    await this.getAll()
    if (this.state.paramValue?.tab === 1) {
      this.gotoDetail(this.state.paramValue?.contactId)
    }
  }
  componentDidUpdate = async (prevProps) => {
    if (prevProps.location !== this.props.location) {
      await this.checkParamValue()
      if (this.state.paramValue?.tab === 1) {
        await this.setState({ modalVisible: false })
        await this.gotoDetail(this.state.paramValue?.contactId)
      }
    }
  }
  checkParamValue = () => {
    const pathname = this.props.location?.pathname
    const paramsString = pathname.split("/")[2]
    const urlParams = new URLSearchParams(paramsString)

    const paramsObject = {}
    for (const [key, value] of urlParams.entries()) {
      paramsObject[key] = Number(value) // Convert value to a number
    }
    this.setState({ paramValue: paramsObject })
  }
  getAll = async () => {
    await this.props.contactStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
  }
  exportExcel = () => {
    this.props.contactStore.exportExcel({ ...this.state.filters })
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
  handleFilterChange = async (filters) => {
    await this.setState({ filters })
    await this.handleTableChange({
      current: 1,
      pageSize: this.state.maxResultCount,
    })
  }
  gotoDetail = async (id?) => {
    if (id) {
      await this.props.contactStore.get(id, false)

      await this.setState({ contactId: id, modalVisible: true })
    } else {
      this.setState({ contactId: undefined, modalVisible: true })
    }
  }
  openAP = () => {
    this.setState({ aPVisible: true })
  }
  closeAP = () => {
    this.setState({ aPVisible: false })
  }
  getAsociateParty = (item) => {
    this.props.contactStore.getListContactShareApproved({
      contactId: item?.id,
    })
    this.setState({ tagetName: item?.contactName })
    this.openAP()
  }
  activateOrDeactivate = async (id: number, isActive) => {
    const self = this
    confirm({
      title: LNotification(
        isActive
          ? "DO_YOU_WANT_TO_ACTIVATE_THIS_ITEM"
          : "DO_YOU_WANT_TO_DEACTIVATE_THIS_ITEM"
      ),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.contactStore.activateOrDeactivate(id, isActive)
        self.handleTableChange({
          current: 1,
          pageSize: this.state.maxResultCount,
        })
      },
    })
  }
  public render() {
    const {
      contactStore: { tableData, isLoading },
    } = this.props
    const columns = gettColumns(
      {
        title: L("CONTACTS_NAME"),
        dataIndex: "contactName",
        key: "contactName",
        width: 210,
        fixed: "left",
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
                        {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
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
      },
      {
        title: L("ASOCIATE_PARTY_LIST"),
        dataIndex: "asociateParty",
        key: "asociateParty",
        width: 70,
        ellipsis: false,
        align: align.center,
        render: (asociateParty: any, item) => (
          <>
            <Popover content={L("SHOW_ASOCIATE_PARTY")}>
              <TeamOutlined onClick={() => this.getAsociateParty(item)} />
            </Popover>
          </>
        ),
      }
    )
    return (
      <>
        <DataTable
          filterComponent={
            <ContactsAndLeadFilterPanel
              handleSearch={this.handleFilterChange}
            />
          }
          onCreate={this.gotoDetail}
          onRefresh={this.getAll}
          handleSearch={this.handleFilterChange}
          searchPlaceholder={"FILTER_KEYWORD_CONTACT"}
          exportExcel={this.exportExcel}
          pagination={{
            pageSize: this.state.maxResultCount,
            total: tableData === undefined ? 0 : tableData.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            dataSource={tableData === undefined ? [] : tableData.items}
            loading={isLoading}
            bordered
            scroll={{
              x: 1000,
              y: "calc(100vh - 23rem)",
              scrollToFirstRowOnChange: true,
            }}
          />
        </DataTable>
        <ContractDetailModal
          id={this.state.contactId}
          paramValue={this.state.paramValue}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({ modalVisible: false })
          }}
          onOk={() => {
            this.getAll()
          }}
        />
        <AsociatePartyModal
          visible={this.state.aPVisible}
          onCancel={() => {
            this.closeAP()
          }}
          tagetName={this.state.tagetName}
          data={this.props.contactStore.listShareContactApproved}
        />
      </>
    )
  }
}
export default withRouter(ContactsAndLead)
