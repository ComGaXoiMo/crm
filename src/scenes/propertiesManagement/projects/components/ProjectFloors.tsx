import * as React from "react"

import { Form, Button, Table, Modal } from "antd"
import { L, LNotification } from "@lib/abpUtility"
import { validateMessages } from "@lib/validation"
import { formatNumberFloat, renderDotActive } from "@lib/helper"
import AppDataStore from "@stores/appDataStore"
import AppConsts, { appPermissions } from "@lib/appconst"
import { RowFloorModel } from "@models/project/projectModel"
import {
  buildEditableCell,
  EditableCell,
} from "@components/DataTable/EditableCell"
import Popconfirm from "antd/lib/popconfirm"
import {
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
  SelectOutlined,
  StopOutlined,
} from "@ant-design/icons/lib"
import DataTable from "@components/DataTable"
import ProjectStore from "@stores/projects/projectStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import withRouter from "@components/Layout/Router/withRouter"
const confirm = Modal.confirm
const { align } = AppConsts
export interface Props {
  appDataStore: AppDataStore;
  projectStore: ProjectStore;
  projectId: number;
  activeKey: any;
  tabKey: any;
}
@inject(Stores.AppDataStore, Stores.ProjectStore)
@observer
class ProjectFloors extends AppComponentListBase<Props, any> {
  formRef: any = React.createRef();

  state = {
    maxResultCount: 10,
    skipCount: 0,
    editingRowKey: "",
    editFloor: {} as any,
    floors: [] as any,
  };

  componentDidMount = async () => {
    await this.getAll()
  };
  async componentDidUpdate(prevProps) {
    if (prevProps.activeKey !== this.props.activeKey) {
      if (this.props.activeKey === this.props.tabKey) {
        await this.getAll()
      }
    }
  }
  getAll = async () => {
    await this.props.projectStore.getFloors(this.props.projectId, {
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
    })

    await this.setState({ floors: this.props.projectStore.floors })
  };

  changeDealPayment = async (name, value) => {
    this.setState({ editFloor: { ...this.state.editFloor, [name]: value } })
  };

  handleAddRow = () => {
    const newRow = new RowFloorModel()
    this.formRef.current?.setFieldsValue({ ...newRow })
    this.setState({
      floors: [newRow, ...this.state.floors],
      editingRowKey: newRow.key,
    })
  };

  handleCreateOrUpdate = async (key) => {
    try {
      const form = this.formRef.current
      const editedRowIndex = this.state.floors.findIndex(
        (item) => item.key === key
      )
      if (editedRowIndex === -1) {
        return
      }
      // Update case
      form.validateFields().then(async (values: any) => {
        const editRecord = this.state.floors.find((item) => item.key === key)
        if (editRecord?.id) {
          await this.props.projectStore.updateFloor({
            ...editRecord,
            ...values,
          })
        } else {
          await this.props.projectStore.createFloor({
            ...values,
            projectId: this.props.projectId,
          })
        }

        this.getAll()
        this.setState({ editingRowKey: "" })
      })
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo)
    }
  };

  isEditing = (record) => record.key === this.state.editingRowKey;

  editRow = (record) => {
    this.formRef.current?.setFieldsValue({ ...record })
    this.setState({ editingRowKey: record.key })
  };

  cancelEditRow = (record) => {
    let { floors } = this.state
    if (!record.id) {
      floors = (floors || []).filter((item) => item.key !== record.key)
    }
    this.setState({ floors, editingRowKey: undefined })
  };
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
        await self.props.projectStore.activateOrDeactivateFloor(id, isActive)
        self.getAll()
      },
    })
  };
  public render() {
    // let { propertyTypes } = this.props.appDataStore;
    const columns = [
      {
        title: L("FLOOR_NAME"),
        dataIndex: "floorName",
        key: "floorName",
        width: 190,
        render: (text: string, item) => (
          <>
            {renderDotActive(item.isActive)} {text}
          </>
        ),
        onCell: (record) =>
          buildEditableCell(
            record,
            "text",
            "floorName",
            L(""),
            this.isEditing,
            null,
            [
              { required: true, message: "Please input this field" },
              { max: 50 },
            ]
          ),
      },

      {
        title: L("FLOOR_SIZE"),
        dataIndex: "size",
        key: "size",
        width: 190,
        align: align.right,
        render: (text) => <>{formatNumberFloat(text)}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "size",
            L(""),
            this.isEditing,
            null,
            [
              { required: true, message: "Please input this field" },
              {
                pattern: /^\d{1,12}(?:\.\d{1,6})?$/,
                message: "Max field length is [12] point [6]",
              },
            ]
          ),
      },

      {
        title: L("NUM_OF_UNIT"),
        dataIndex: "numberOfUnits",
        key: "numberOfUnits",
        width: 100,
        align: align.right,
        render: (text: string) => <>{text ?? "0"}</>,
      },
      {
        title: L("ACTIONS"),
        dataIndex: "action",
        width: "10%",
        align: align.center,
        fixed: align.right,
        render: (_: any, record: any) => {
          const editable = this.isEditing(record)
          return editable ? (
            <span>
              <Button
                size="small"
                className="ml-1"
                shape="circle"
                icon={<SaveOutlined />}
                disabled={!this.isGranted(appPermissions.project.update)}
                onClick={() => this.handleCreateOrUpdate(record.key)}
              />
              <Popconfirm
                title={L("ARE_YOU_SURE_YOU_WANT_CANCEL")}
                onConfirm={() => this.cancelEditRow(record)}
              >
                <Button
                  size="small"
                  className="ml-1"
                  shape="circle"
                  icon={<CloseOutlined />}
                />
              </Popconfirm>
            </span>
          ) : (
            <span>
              <Button
                size="small"
                className="ml-1"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => this.editRow(record)}
                disabled={
                  !this.isGranted(appPermissions.project.update) ||
                  this.state.editingRowKey?.length > 0
                }
              />
              <Button
                size="small"
                className="ml-1"
                shape="circle"
                icon={record.isActive ? <StopOutlined /> : <SelectOutlined />}
                onClick={() =>
                  this.activateOrDeactivate(record.id, !record.isActive)
                }
                disabled={
                  !this.isGranted(appPermissions.project.delete) ||
                  this.state.editingRowKey?.length > 0
                }
              />
            </span>
          )
        },
      },
      {
        title: L(""),
        dataIndex: "",
        key: "",
        width: "",
        // align: align.right,
        render: () => <></>,
      },
      SystemHistoryColumn,
    ]

    const { floors } = this.state

    return (
      <>
        <DataTable
          title={this.L("DEAL_PAYMENT_LIST")}
          onCreate={
            this.isGranted(appPermissions.project.create)
              ? this.handleAddRow
              : undefined
          }
          disable={this.state.editingRowKey?.length > 0}
        >
          <Form
            ref={this.formRef}
            component={false}
            validateMessages={validateMessages}
            layout={"vertical"}
          >
            <Table
              size="middle"
              className="custom-ant-table ant-form-vertical"
              rowKey={(record) => record.key}
              columns={columns}
              pagination={false}
              dataSource={floors || []}
              scroll={{ x: 800 }}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              expandable={{
                expandedRowRender: (record) => {
                  const getcolumnsEx = () => {
                    const data = [] as any
                    data.push({
                      title: L("UNIT_TYPE"),
                      dataIndex: "unitType",
                      key: "unitType",
                      align: align.center,
                      render: (unitTypeId) => <>{unitTypeId}</>,
                    });
                    (record?.countUnitType || []).forEach((item) => {
                      data.push({
                        title: (
                          <div style={{ padding: "0 10px" }}>
                            {item.unitTypeName}
                          </div>
                        ),
                        dataIndex: item.unitTypeId,
                        key: item.unitTypeId,
                        align: align.center,
                        render: (unitTypeId) => <>{unitTypeId}</>,
                      })
                    })
                    return data
                  }
                  const columnsExpand = getcolumnsEx()
                  let data = [] as any
                  let das = { unitType: "Count" } as any
                  record?.countUnitType.map((item) => {
                    das = { ...das, [item.unitTypeId]: item.totalCount }
                  })
                  data = [...data, das]
                  return (
                    <div className="full-width expand-table ">
                      <Table
                        size="small"
                        className=""
                        pagination={false}
                        columns={columnsExpand}
                        dataSource={data ?? []}
                      />
                    </div>
                  )
                },
                rowExpandable: (record) => record.id,
              }}
            />
          </Form>
        </DataTable>
      </>
    )
  }
}

export default withRouter(ProjectFloors)
