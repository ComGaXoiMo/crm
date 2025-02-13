import { L } from "@lib/abpUtility"
import { Col, DatePicker, Form, Modal, Row, Select } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import _ from "lodash"
import { filterOptions, renderOptions } from "@lib/helper"
import TextArea from "antd/lib/input/TextArea"
import AppConsts, { dateFormat, dateTimeFormat } from "@lib/appconst"
import ReservationStore from "@stores/activity/reservationStore"
import FormSelect from "@components/FormItem/FormSelect"
import projectService from "@services/projects/projectService"
import unitService from "@services/projects/unitService"
import inquiryService from "@services/projects/inquiryService"
import type { PagedResultDto } from "@services/dto/pagedResultDto"
import dayjs from "dayjs"
const { unitStatus } = AppConsts
interface Props {
  visible: boolean
  onCancel: () => void
  onOk: () => void
  filter: any
  inquiryId: any
  data: any
  reservationStore: ReservationStore
}

@inject(Stores.ReservationStore)
@observer
class AddReservation extends AppComponentListBase<Props> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = { listInquiry: [] as any, listProject: [] as any }
  }
  componentDidMount(): void {
    this.getListInquiry("")
    this.initValue()
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.props.reservationStore.getSettingReservation()
        this.initValue()
        if (!this.props.inquiryId) {
          this.getListInquiry("")
        }
      }
    }
  }

  initValue = async () => {
    this.getUnit("")
    if (this.props.filter.projectId) {
      this.getProject(this.props.filter.projectId)
    }
    this.formRef.current?.setFieldsValue({
      projectId: this.props.filter.projectId,
      fromDate: dayjs(this.props.filter.fromDate),
      toDate: dayjs(this.props.filter.toDate),
      unitIds: this.props.data,
    })
  }
  getListInquiry = async (keyword) => {
    const pageResult: PagedResultDto<any> = await inquiryService.getAll({
      keyword: keyword,
      isActive: true,
      maxResultCount: 10,
      skipCount: 0,
    })
    const listInquiry = pageResult?.items.map((inquiry) => {
      return {
        id: inquiry?.id,
        name: inquiry?.inquiryName,
      }
    })
    this.setState({ listInquiry })
  }

  getProject = async (id) => {
    const res = await projectService.get(id)

    await this.setState({
      listProject: [{ id: res?.id, label: res?.projectCode }],
    })
  }
  getUnit = async (keyword) => {
    const res = await unitService.getAllRes({
      pageSize: 10,
      keyword,
      unitStatusIds: [unitStatus.vacant, unitStatus.showRoom],
      projectId: this.props.filter.projectId,
      fromDate: this.props.filter.fromDate,
      toDate: this.props.filter.toDate,
      isActive: true,
    })
    const newUnit = [] as any
    res.items.map((i) => {
      newUnit.push({ id: i.id, name: `${i.projectCode}-${i.unitName}` })
    })

    await this.setState({ listUnit: newUnit })
  }

  handleOk = async () => {
    let params = await this.formRef.current?.validateFields()
    const reservationUnit = this.props.data.map((item) => ({
      unitId: item,
      unitStatusId: 1,
    }))
    params = await {
      inquiryId: this.props.inquiryId,
      ...params,
      unitIds: this.props.data,
      reservationUnit: [...reservationUnit],
    }

    await this.props.reservationStore.createOrUpdate(params)
    await this.props.reservationStore.getAll({
      inquiryId: this.props.inquiryId,
      maxResultCount: 10,
      skipCount: 0,
    })
    this.props.onOk()
  }
  render(): React.ReactNode {
    const {
      visible,
      onCancel,
      reservationStore: { reservationSetting },
    } = this.props
    const { listInquiry } = this.state

    const exprydate = dayjs().add(reservationSetting?.expireDay, "days")
    return (
      this.props.visible && (
        <Modal
          title={L("CREATE_RESERVATION")}
          visible={visible}
          // visible={true}
          width={"50%"}
          onOk={() => this.handleOk()}
          onCancel={onCancel}
          closable={false}
        >
          <Form ref={this.formRef} layout={"vertical"} size="middle">
            <div className="w-100">
              <Row gutter={[8, 0]} style={{ alignItems: "center" }}>
                {!this.props.inquiryId && (
                  <Col sm={{ span: 24 }}>
                    <Form.Item
                      rules={[{ required: true }]}
                      label={L("INQUIRY")}
                      name="inquiryId"
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showSearch
                        allowClear
                        filterOption={filterOptions}
                        className="full-width"
                        onSearch={_.debounce(
                          (e) => this.getListInquiry(e),
                          1000
                        )}
                      >
                        {renderOptions(listInquiry)}
                      </Select>
                    </Form.Item>
                  </Col>
                )}

                <Col sm={{ span: 24, offset: 0 }}>
                  <FormSelect
                    rule={[{ required: true }]}
                    options={this.state.listProject}
                    disabled
                    // selectProps={{ mode: "multiple" }}
                    label={L("PROJECT_CODE")}
                    onChange={async (id) => {
                      this.formRef.current?.resetFields(["unitIds"])
                      await this.setState({ projectChoose: id })
                      if (this.state.fromDate && this.state.toDate) {
                        await this.getUnit("")
                      }
                    }}
                    name={["projectId"]}
                  />
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
                      disabled
                      disabledDate={(current) =>
                        this.formRef.current?.getFieldValue("toDate")
                          ? current >
                            dayjs(this.formRef.current?.getFieldValue("toDate"))
                          : false
                      }
                      onChange={async (value) => {
                        this.formRef.current?.resetFields(["unitIds"])
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
                      disabledDate={(current) =>
                        current <
                        dayjs(this.formRef.current?.getFieldValue("fromDate"))
                      }
                      format={dateFormat}
                      disabled
                      onChange={async (value) => {
                        this.formRef.current?.resetFields(["unitIds"])
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
                <Col sm={{ span: 24 }}>
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
                      getPopupContainer={(trigger) => trigger.parentNode}
                      filterOption={false}
                      className="w-100"
                      mode="multiple"
                      onSearch={_.debounce((e) => this.getUnit(e), 600)}
                      allowClear
                      disabled
                      showSearch
                    >
                      {this.renderOptions(this.state.listUnit)}
                    </Select>
                  </Form.Item>
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
            </div>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(AddReservation)
