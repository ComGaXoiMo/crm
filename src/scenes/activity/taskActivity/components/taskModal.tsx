import { L } from "@lib/abpUtility"
import { Col, DatePicker, Form, Input, Modal, Row, Select } from "antd"
import React from "react"
import TextArea from "antd/lib/input/TextArea"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import TaskStore from "@stores/activity/taskStore"
import { addItemToList, filterOptions } from "@lib/helper"
import dayjs from "dayjs"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import userService from "@services/administrator/user/userService"
import _ from "lodash"
import AppDataStore from "@stores/appDataStore"
import { dateFormat } from "@lib/appconst"
import inquiryService from "@services/projects/inquiryService"
import type { PagedResultDto } from "@services/dto/pagedResultDto"

interface Props {
  visible: boolean
  taskStore: TaskStore
  appDataStore: AppDataStore
  inquiryId: any
  dueDate: any
  listPic: any[]
  onClose: () => void
  onOk: (params) => void
}
interface State {
  listUser: any[]
  listInquiry: any[]
}
@inject(Stores.TaskStore, Stores.AppDataStore)
@observer
class TaskModal extends AppComponentListBase<Props, State> {
  form: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = { listUser: [], listInquiry: [] as any }
  }
  componentDidMount(): void {
    this.getListInquiry("")
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      const { taskDetail } = this.props.taskStore
      if (this.props.visible) {
        this.getUser("")
        this.getListInquiry("")

        if (taskDetail?.id) {
          this.form.current?.setFieldsValue({
            ...taskDetail,
            dueDate: dayjs(taskDetail?.dueDate),
            remindDate: taskDetail?.remindDate
              ? dayjs(taskDetail?.remindDate)
              : undefined,
            userIds: taskDetail?.inquiryTaskUser?.map((item) => item?.userId),
          })
        }
        if (this.props.dueDate) {
          this.form.current?.setFieldValue("dueDate", dayjs(this.props.dueDate))
        }
        if (this.props.listPic) {
          const newListUser = [...this.state.listUser]
          await this.props.listPic?.map((item) => {
            addItemToList(newListUser, {
              id: item.id,
              name: item.name,
            })
          })
          await this.setState({ listUser: newListUser })
          this.form.current?.setFieldValue(
            "userIds",
            this.props.listPic?.map((item) => {
              return item?.id
            })
          )
        }

        const newListUser = [...this.state.listUser]
        await taskDetail?.inquiryTaskUser?.map((item) => {
          addItemToList(newListUser, {
            id: item.userId,
            name: item.user?.displayName,
          })
        })
        await this.setState({ listUser: newListUser })
        addItemToList(this.state.listInquiry, {
          id: taskDetail.inquiryId,
          name: taskDetail.inquiry?.inquiryName,
        })
      }
    }
  }
  onOk = async () => {
    const { taskDetail } = this.props.taskStore
    let params = await this.form.current?.validateFields()
    params = await {
      inquiryId: this.props.inquiryId,
      ...taskDetail,
      ...params,
      reservationStatusId: 1,
    }

    await this.props.taskStore.createOrUpdate(params)
    await this.props.onOk(params)
  }

  getUser = async (keyword) => {
    const res = await userService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword: keyword,
    })
    const lsitUser = [] as any

    await res?.items.map((i) => {
      lsitUser.push({ id: i.id, name: i.displayName })
    })
    await this.setState({ listUser: lsitUser })
  }
  getListInquiry = async (keyword) => {
    const pageResult: PagedResultDto<any> = await inquiryService.getAll({
      keyword: keyword,
      isActive: true,
      maxResultCount: 10,
      skipCount: 0,
    })
    const listInquiries = [] as any

    await pageResult?.items?.map((i) => {
      listInquiries.push({ id: i.id, name: i.inquiryName })
    })
    await this.setState({ listInquiry: listInquiries })
  }
  disableDate = (current) => {
    return current > dayjs(this.form.current?.getFieldValue("dueDate"))
  }
  render(): React.ReactNode {
    const {
      visible,
      onClose,
      taskStore: { taskDetail, isLoading },
      appDataStore: { taskStatus },
    } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          width={"50%"}
          confirmLoading={isLoading}
          destroyOnClose
          title={L(taskDetail?.subject ?? "NEW_TASK")}
          cancelText={L("BTN_CANCEL")}
          onCancel={onClose}
          onOk={this.onOk}
        >
          <Form
            layout={"vertical"}
            ref={this.form}
            //  onFinish={this.onSave}
            // validateMessages={validateMessages}
            size="middle"
          >
            <Row gutter={[8, 0]}>
              {!this.props.inquiryId && (
                <Col sm={{ span: 24 }}>
                  <Form.Item label={L("INQUIRY")} name="inquiryId">
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      allowClear
                      filterOption={filterOptions}
                      className="full-width"
                      onSearch={_.debounce((e) => this.getListInquiry(e), 1000)}
                    >
                      {this.renderOptions(this.state.listInquiry)}
                    </Select>
                  </Form.Item>
                </Col>
              )}

              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("SUBJECT")}
                  name="subject"
                >
                  <Input placeholder={L("")}></Input>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("DUE_DATE")}
                  name="dueDate"
                >
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("REMIND_DATE")}
                  name="remindDate"
                >
                  <DatePicker
                    disabledDate={this.disableDate}
                    className="w-100"
                    format={dateFormat}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  // rules={[{ required: true }]}
                  label={L("PICS")}
                  name="userIds"
                >
                  <Select
                    filterOption={filterOptions}
                    placeholder={L("")}
                    mode={"multiple"}
                    onSearch={_.debounce((e) => this.getUser(e), 1000)}
                  >
                    {this.renderOptions(this.state.listUser)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("TASK_STATUS")}
                  name="inquiryTaskStatusId"
                  initialValue={1}
                >
                  <Select placeholder={L("")}>
                    {this.renderOptions(taskStatus)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("REMARK")}
                  name="description"
                  rules={[{ required: true }]}
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
export default withRouter(TaskModal)
