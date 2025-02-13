import { L } from "@lib/abpUtility"
import {
  Col,
  Form,
  Modal,
  Row,
  Select,
  DatePicker,
  Tag,
  Button,
  Popconfirm,
  Tooltip,
} from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
import TextArea from "antd/lib/input/TextArea"
import dayjs from "dayjs"
import ReservationStore from "@stores/activity/reservationStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import unitService from "@services/projects/unitService"
import projectService from "@services/projects/projectService"
import {
  addItemToList,
  filterOptions,
  filterOptionsWithNotSpace,
} from "@lib/helper"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { validateMessages } from "@lib/validation"
import _ from "lodash"
import AppConsts, { dateFormat, dateTimeFormat } from "@lib/appconst"
import { OrderedListOutlined } from "@ant-design/icons"

const { unitReservationStatus, unitStatus } = AppConsts
interface Props {
  visible: boolean
  reservationStore: ReservationStore
  inquiryId: any
  onClose: () => void
  onOk: (params) => void
}

interface State {
  listProject: any[]
  listUnit: any[]
  projectChoose: any
  fromDate: any
  toDate: any
}
@inject(Stores.ReservationStore)
@observer
class BookingModal extends AppComponentListBase<Props, State> {
  form = React.createRef<FormInstance>()

  constructor(props) {
    super(props)
    this.state = {
      listProject: [],
      listUnit: [] as any,
      projectChoose: undefined,
      toDate: undefined,
      fromDate: undefined,
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        const { reservationDetail } = this.props.reservationStore
        if (reservationDetail?.id) {
          await this.initProject(reservationDetail?.reservationUnit[0]?.unit)
          await this.initUnit()
          this.form.current?.setFieldsValue({
            ...reservationDetail,
            unitIds: reservationDetail?.reservationUnit?.map(
              (item) => item?.unitId
            ),
            reservationTime: dayjs(reservationDetail.reservationTime),
            creationTime: dayjs(reservationDetail.creationTime),
            fromDate: reservationDetail.fromDate
              ? dayjs(reservationDetail.fromDate)
              : undefined,
            toDate: reservationDetail.toDate
              ? dayjs(reservationDetail.toDate)
              : undefined,
            projectId: reservationDetail?.reservationUnit[0]?.unit.projectId,
            expiryDate: dayjs(reservationDetail?.expiryDate),
          })
        } else {
          this.setState({ listUnit: [] })
          await this.getProject("")
        }
      }
    }
  }
  uniqueValues = (nums) => [...new Set(nums)]
  initProject = async (data) => {
    await this.setState({
      listProject: [{ id: data?.projectId, label: data?.projectCode }],
    })
  }
  initUnit = async (data?) => {
    const { reservationDetail } = this.props.reservationStore
    const newListUnit = [] as any
    await reservationDetail?.reservationUnit.map((item) => {
      addItemToList(newListUnit, {
        id: item.unitId,
        name: `${item.unit.unitName}`,
      })
    })
    await this.setState({
      listUnit: newListUnit,
      projectChoose: reservationDetail?.reservationUnit[0]?.unit?.projectId,
      fromDate: reservationDetail?.fromDate,
      toDate: reservationDetail?.toDate,
    })
  }
  getProject = async (keyword) => {
    const res = await projectService.getAll({
      pageSize: 10,
      keyword,
      isActive: true,
    })
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectCode }
    })

    await this.setState({ listProject: newProjects })
  }
  getUnit = async (keyword) => {
    const res = await unitService.getAllRes({
      pageSize: 10,
      keyword,

      unitStatusIds: [unitStatus.vacant, unitStatus.showRoom],
      projectId: this.state.projectChoose,
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      isActive: true,
    })
    const newUnit = res.items.map((i) => {
      return {
        id: i.id,
        name: `${i.unitName}`,
        isHightlight: i.isReservation,
      }
    })
    await this.setState({ listUnit: newUnit })
  }
  removeAllUnit = async () => {
    const { reservationDetail } = this.props.reservationStore

    const changeListUnit = reservationDetail?.reservationUnit.map((base) => {
      return { ...base, unitStatusId: unitReservationStatus.userCancel }
    })

    const params = {
      ...reservationDetail,
      reservationUnit: [...changeListUnit],
    }

    await this.props.reservationStore.createOrUpdate(params)
    await this.props.onOk(params)
    this.setState({
      projectChoose: undefined,
      toDate: undefined,
      fromDate: undefined,
    })
  }
  onOk = async () => {
    const { reservationDetail } = this.props.reservationStore
    let params = await this.form.current?.validateFields()
    let reservationUnit = [] as any
    params?.unitIds?.map((item) => {
      {
        reservationUnit.push({
          unitId: item,
          unitStatusId: unitReservationStatus.new,
        })
      }
    })
    if (reservationDetail?.id) {
      const checkListUnit = reservationDetail?.reservationUnit.map((base) => {
        const check = reservationUnit.find(
          (asNew) => asNew.unitId === base.unitId
        )
        if (check) return { ...base }
        else return { ...base, unitStatusId: unitReservationStatus.userCancel }
      })
      reservationUnit = [...checkListUnit]
    }

    params = {
      inquiryId: this.props.inquiryId,
      ...reservationDetail,
      ...params,
      reservationUnit: [...reservationUnit],
    }

    await this.props.reservationStore.createOrUpdate(params)
    await this.props.onOk(params)
    this.setState({
      projectChoose: undefined,
      toDate: undefined,
      fromDate: undefined,
    })
  }
  oncheckPriorityUnit = async () => {
    const params = await this.form.current?.getFieldValue("unitIds")
    const priorityUnit =
      await this.props.reservationStore.getPriorityReservationUnit({
        unitIds: params,
        reservationId: this.props.reservationStore.reservationDetail?.id,
      })
    const newUnit = priorityUnit.map((i) => {
      return {
        id: i.unitId,
        name: `${i.unitName} - (${i.number > 0 ? i.number : 1})`,
        isHightlight: i.number > 0,
      }
    })
    await this.setState({ listUnit: newUnit })
  }
  onClose = () => {
    this.props.onClose()
    this.setState({
      projectChoose: undefined,
      toDate: undefined,
      fromDate: undefined,
    })
  }
  tagRender = (props) => {
    const { label, value, closable, onClose } = props
    const initValue =
      this.props.reservationStore.reservationDetail.reservationUnit?.find(
        (item) => item.unitId === value
      )
    let color = ""
    if (
      initValue?.unitStatusId &&
      initValue?.unitStatusId === unitReservationStatus.userCancel
    ) {
      color = "red"
    }
    let CLASSNAME = ""
    if (initValue) {
      switch (initValue?.unitStatusId) {
        case unitReservationStatus.cancel:
          CLASSNAME = "strike-text"
          break
        case unitReservationStatus.userCancel:
          CLASSNAME = "strike-text"
          break
        default:
          CLASSNAME = ""
      }
    }

    return (
      <Tag
        color={color}
        className={CLASSNAME}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    )
  }
  render(): React.ReactNode {
    const {
      visible,
      reservationStore: { reservationDetail, reservationSetting, isLoading },
    } = this.props
    const disableUnit =
      this.state.projectChoose === undefined ||
      !this.state.fromDate ||
      !this.state.toDate
    const exprydate = dayjs().add(
      this.props.reservationStore.reservationSetting?.expireDay,
      "days"
    )
    return (
      this.props.visible && (
        <Modal
          open={visible}
          closable={false}
          confirmLoading={isLoading}
          maskClosable
          title={L(reservationDetail?.description ?? "NEW_RESERVATION")}
          footer={
            <div className="footer-modal">
              <div>
                <Button onClick={this.onClose}>{L("BTN_CANCEL")}</Button>
                <Button className="button-primary" onClick={this.onOk}>
                  {L("BTN_OK")}
                </Button>
              </div>
              {reservationDetail?.id && (
                <Popconfirm
                  title={L("ARE_YOU_WANT_TO_DELETE_RESERVATION")}
                  onConfirm={this.removeAllUnit}
                >
                  <Button danger>{L("BTN_DELETE_RESERVATION")}</Button>
                </Popconfirm>
              )}
            </div>
          }
        >
          <Form
            layout={"vertical"}
            ref={this.form}
            //  onFinish={this.onSave}
            validateMessages={validateMessages}
            size="middle"
          >
            <Row gutter={[8, 0]}>
              <Col sm={{ span: 24, offset: 0 }}>
                <Form.Item
                  label={L("PROJECT_CODE")}
                  name={["projectId"]}
                  rules={[{ required: true }]}
                >
                  <Select
                    filterOption={filterOptions}
                    className="w-100"
                    onSearch={_.debounce((e) => this.getProject(e), 300)}
                    allowClear
                    showSearch
                    onChange={async (id) => {
                      this.form.current?.resetFields(["unitIds"])
                      await this.setState({ projectChoose: id })
                      if (this.state.fromDate && this.state.toDate) {
                        await this.getUnit("")
                      }
                    }}
                    disabled={this.props.reservationStore.reservationDetail?.id}
                  >
                    {this.renderOptions(this.state.listProject)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 12, offset: 0 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("FROM_DATE_UNIT_VACANT")}
                  name="fromDate"
                >
                  <DatePicker
                    className="w-100"
                    format={dateFormat}
                    disabled={this.props.reservationStore.reservationDetail?.id}
                    disabledDate={(current) =>
                      this.form.current?.getFieldValue("toDate")
                        ? current >
                          dayjs(this.form.current?.getFieldValue("toDate"))
                        : false
                    }
                    onChange={async (value) => {
                      this.form.current?.resetFields(["unitIds"])
                      await this.setState({
                        fromDate: dayjs(value).startOf("days").toJSON(),
                      })
                      if (this.state.toDate && this.state.projectChoose) {
                        await this.getUnit("")
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12, offset: 0 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("TO_DATE_UNIT_VACANT")}
                  name="toDate"
                >
                  <DatePicker
                    className="w-100"
                    disabled={this.props.reservationStore.reservationDetail?.id}
                    disabledDate={(current) =>
                      current <
                      dayjs(this.form.current?.getFieldValue("fromDate"))
                    }
                    format={dateFormat}
                    onChange={async (value) => {
                      this.form.current?.resetFields(["unitIds"])
                      await this.setState({
                        toDate: dayjs(value).endOf("days").toJSON(),
                      })
                      if (this.state.fromDate && this.state.projectChoose) {
                        await this.getUnit("")
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 22 }}>
                <Form.Item
                  label={L("UNIT")}
                  name="unitIds"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one item",
                    },
                    {
                      max: reservationSetting?.maxUnitPerSeller ?? 2,
                      type: "array",
                      message: `You can select up to ${
                        reservationSetting?.maxUnitPerSeller ?? 2
                      } items`,
                    },
                  ]}
                >
                  <Select
                    filterOption={filterOptionsWithNotSpace}
                    className="w-100"
                    mode="multiple"
                    tagRender={this.tagRender}
                    disabled={disableUnit}
                    onSearch={_.debounce((e) => this.getUnit(e), 600)}
                    allowClear
                    showSearch={
                      this.props.reservationStore.reservationDetail?.id
                        ? false
                        : true
                    }
                  >
                    {this.renderOptions(this.state.listUnit)}
                  </Select>
                </Form.Item>
              </Col>
              <Col
                sm={{ span: 2 }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Tooltip title={L("CHECK_PRIORITY")}>
                  <Button
                    shape="circle"
                    type="text"
                    disabled={disableUnit}
                    onClick={this.oncheckPriorityUnit}
                    icon={<OrderedListOutlined />}
                  />
                </Tooltip>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  initialValue={dayjs()}
                  label={L("CREATE_TIME")}
                  name="reservationTime"
                >
                  <DatePicker
                    className="full-width"
                    disabled
                    format={dateTimeFormat}
                    showTime
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  initialValue={exprydate}
                  label={L("EXPRY_DATE")}
                  name="expiryDate"
                >
                  <DatePicker
                    className="full-width"
                    disabled
                    format={dateTimeFormat}
                    showTime
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("DESCRIPTION")}
                  name="description"
                >
                  <TextArea placeholder={L("")}></TextArea>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(BookingModal)
