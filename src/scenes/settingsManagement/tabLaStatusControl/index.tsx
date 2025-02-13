import * as React from "react"

import { Button, Form, Popconfirm, Spin, Table } from "antd"
import { inject, observer } from "mobx-react"

import AppComponentBase from "../../../components/AppComponentBase"

import withRouter from "@components/Layout/Router/withRouter"
import Stores from "@stores/storeIdentifier"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import { L } from "@lib/abpUtility"
import AppConsts, { appStatusColors } from "@lib/appconst"
import {
  EditableCell,
  buildEditableCell,
} from "@components/DataTable/EditableCell"
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditFilled,
} from "@ant-design/icons"
const { align } = AppConsts
export interface Props {
  leaseAgreementStore: LeaseAgreementStore;
  selectItem: any;
  tabKey: any;
}

@inject(Stores.LeaseAgreementStore)
@observer
class LaStatusControl extends AppComponentBase<Props> {
  formRef: any = React.createRef();

  state = {
    dataTable: [] as any,
    editingKey: undefined,
  };
  isEditing = (record: any) => record.id === this.state.editingKey;

  async componentDidMount() {
    await this.initValue()
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === this.props.tabKey) {
        await this.initValue()
      }
    }
  }
  async initValue() {
    await this.props.leaseAgreementStore.getLAStatusSetting()
    this.setState({
      dataTable: this.props.leaseAgreementStore.laStatusSetting,
    })
  }
  saveRow = async (id?) => {
    const values = await this.formRef.current?.validateFields()
    await this.props.leaseAgreementStore.updateLAStatusSetting({
      ...values,
      id: id,
    })

    this.setState({ editingKey: undefined })

    await this.initValue()
  };
  public render() {
    const columns = [
      {
        title: L("LA_STATUS"),
        dataIndex: "name",
        key: "name",
        width: "40%",
        ellipsis: false,
        render: (name, row) => <>{name}</>,
      },
      {
        title: L("LA_TURN_IN_TO_DROP_IF_THE_STATUS_IS_NOT_CHANGED_AFTER_DAYS"),
        dataIndex: "numDay",
        key: "numDay",
        width: "45%",
        ellipsis: false,
        align: align.right,
        render: (numDay, row) => <>{numDay}</>,
        onCell: (record) =>
          buildEditableCell(record, "number", "numDay", L(""), this.isEditing),
      },

      {
        title: "",
        width: "15%",
        align: align.center,
        dataIndex: "action",
        key: "action",
        render: (_: any, record, index) => {
          return this.state.editingKey === record.id ? (
            <>
              <Popconfirm
                title={L("ARE_YOU_SURE_TO_CHANGE_NUM_OF_DAY")}
                onConfirm={() => {
                  this.saveRow(record.id)
                }}
              >
                <Button
                  type="text"
                  icon={
                    <CheckCircleFilled
                      style={{ color: appStatusColors.success }}
                    />
                  }
                />
              </Popconfirm>

              <Button
                type="text"
                icon={
                  <CloseCircleFilled style={{ color: appStatusColors.error }} />
                }
                onClick={() => {
                  this.setState({ editingKey: undefined })
                }}
              />
            </>
          ) : (
            <>
              <Button
                type="link"
                icon={<EditFilled />}
                disabled={this.state.editingKey !== undefined}
                onClick={() => {
                  this.formRef.current?.setFieldsValue({
                    ...record,
                  })
                  this.setState({ editingKey: record.id })
                }}
              />
            </>
          )
        },
      },
    ]
    return (
      <>
        <Spin spinning={this.props.leaseAgreementStore.isLoading}>
          <Form ref={this.formRef} component={false}>
            <Table
              size="middle"
              className="custom-ant-row"
              rowKey={(record) => record.id}
              columns={columns}
              style={{
                // borderRadius: 12,
                width: "50%",
                minHeight: "40vh",
                padding: 20,
              }}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              pagination={false}
              dataSource={this.state.dataTable ?? []}
            />
          </Form>
        </Spin>
      </>
    )
  }
}

export default withRouter(LaStatusControl)
