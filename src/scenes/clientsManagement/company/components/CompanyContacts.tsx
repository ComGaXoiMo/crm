import * as React from "react"

import { Table } from "antd"

import { AppComponentListBase } from "@components/AppComponentBase"
import { L } from "@lib/abpUtility"
import { inject, observer } from "mobx-react"
import AppConsts from "@lib/appconst"
import ContactStore from "@stores/clientManagement/contactStore"
import Stores from "@stores/storeIdentifier"
import DataTable from "@components/DataTable"
import withRouter from "@components/Layout/Router/withRouter"
import { renderDotActive } from "@lib/helper"

const { align } = AppConsts

export interface ICompanyContactsProps {
  contactStore: ContactStore
  companyId?: number
}

export interface ICompanyContactsState {
  pageSize: number
  pageNumber: number
}

@inject(Stores.ContactStore)
@observer
class CompanyContacts extends AppComponentListBase<
  ICompanyContactsProps,
  ICompanyContactsState
> {
  formRef: any = React.createRef()
  state = {
    pageSize: 10,
    pageNumber: 1,
  }

  async componentDidMount() {
    await this.getAll()
  }

  getAll = async () => {
    await this.props.contactStore.getAllinCompany({
      pageSize: this.state.pageSize,
      pageNumber: this.state.pageNumber,
      companyId: this.props.companyId,
    })
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      { pageNumber: pagination.current, pageSize: pagination.pageSize },
      async () => await this.getAll()
    )
  }

  public render() {
    const {
      contactStore: { contactInCompany },
    } = this.props
    const columns = [
      {
        title: L("CONTACT_NAME"),
        dataIndex: "name",
        key: "name",
        width: "20%",
        ellipsis: false,
        render: (text, row) => (
          <>
            {renderDotActive(row.isActive)} {text}
          </>
        ),
      },
      {
        title: L("CONTACT_CONTACT_INFO"),
        dataIndex: "phone",
        key: "phone",
        width: "20%",
        ellipsis: false,
        render: (text, row) => <> {text}</>,
      },
      // {
      //   title: L("CONTACT_LEVEL"),
      //   dataIndex: "level",
      //   key: "level",
      //   width: 150,
      //   render: (level) => <>{level?.levelName ?? ""}</>,
      // },
      {
        title: L("CONTACT_POSITION"),
        dataIndex: "position",
        key: "position",
        width: "15%",
        ellipsis: false,
        render: (position, row) => (
          <>
            {row?.companyId === this.props.companyId
              ? position
              : row?.companyContact?.find(
                  (item) => item.companyId === this.props.companyId
                )?.title}
          </>
        ),
      },

      // {
      //   title: L("CONTACT_DESCRIPTION"),
      //   dataIndex: "description",
      //   key: "description",
      //   width: "20%",
      //   ellipsis: false,
      //   render: (text) => <div className="text-muted small">{text}</div>,
      // },
      {
        title: L("IS_ACTIVE"),
        dataIndex: "isActive",
        key: "isActive",
        width: "10%",
        align: align.center,
        render: this.renderIsActive,
      },
    ]

    return (
      <>
        <DataTable
          title={this.L("CONTACT_LIST")}
          // onCreate={() => this.gotoDetail(null)}
          pagination={{
            pageSize: this.state.pageSize,
            total:
              contactInCompany === undefined ? 0 : contactInCompany.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-table"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            loading={this.props.contactStore.isLoading}
            dataSource={
              contactInCompany === undefined ? [] : contactInCompany.items
            }
          />
        </DataTable>
      </>
    )
  }
}

export default withRouter(CompanyContacts)
