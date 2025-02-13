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
import { dateTimeFormat } from "@lib/appconst"
import SiteVisitStore from "@stores/activity/siteVisitStore"
import inquiryService from "@services/projects/inquiryService"
import type { PagedResultDto } from "@services/dto/pagedResultDto"
interface Props {
  visible: boolean
  onCancel: () => void
  onOk: () => void
  data: any
  inquiryId: any
  siteVisitStore: SiteVisitStore
}

interface State {
  listInquiry: any[]
}

@inject(Stores.SiteVisitStore)
@observer
class AddSiteVisitModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = { listInquiry: [] as any }
  }
  componentDidMount(): void {
    this.getListInquiry("")
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        if (!this.props.inquiryId) {
          this.getListInquiry("")
        }
      }
    }
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
  handleOk = async () => {
    let params = await this.formRef.current?.validateFields()
    params = await {
      inquiryId: this.props.inquiryId,
      ...params,
      unitIds: this.props.data,
    }

    await this.props.siteVisitStore.createOrUpdate(params)
    await this.props.siteVisitStore.getAll({
      inquiryId: this.props.inquiryId,
      maxResultCount: 10,
      skipCount: 0,
    })
    this.props.onOk()
  }
  render(): React.ReactNode {
    const { listInquiry } = this.state

    const { visible, onCancel } = this.props

    return (
      this.props.visible && (
        <Modal
          title={L("CREATE_SITE_VISIT")}
          visible={visible}
          // visible={true}
          width={"50%"}
          maskClosable={false}
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

                <Col sm={{ span: 24 }}>
                  <Form.Item
                    rules={[{ required: true }]}
                    label={L("SITE_VISIT_DATE")}
                    name="siteVisitTime"
                  >
                    <DatePicker
                      showTime
                      className="w-100"
                      format={dateTimeFormat}
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
export default withRouter(AddSiteVisitModal)
