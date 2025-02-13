import { L } from "@lib/abpUtility"
import { Col, DatePicker, Form, Modal, Row, Select } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
import TextArea from "antd/lib/input/TextArea"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import SiteVisitStore from "@stores/activity/siteVisitStore"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import moment from "moment"
import { dateTimeFormat } from "@lib/appconst"
import FormSelect from "@components/FormItem/FormSelect"
import projectService from "@services/projects/projectService"
import unitService from "@services/projects/unitService"
import _ from "lodash"

interface Props {
  visible: boolean;
  siteVisitStore: SiteVisitStore;
  inquiryId: any;
  onClose: () => void;
  onOk: (params) => void;
}

interface State {
  listProject: any[];
  listProjectChoose: any[];
  listUnit: any[];
}

@inject(Stores.SiteVisitStore)
@observer
class SiteVisitModal extends AppComponentListBase<Props, State> {
  form = React.createRef<FormInstance>();

  constructor(props) {
    super(props)
    this.state = {
      listProject: [],
      listUnit: [] as any,
      listProjectChoose: [] as any,
    }
  }

  async componentDidUpdate(prevProps) {
    const { siteVisitDetail } = this.props.siteVisitStore
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.getProject(""), this.getUnit("")
        this.form.current?.setFieldsValue({
          ...siteVisitDetail,
          siteVisitTime: moment(siteVisitDetail?.siteVisitTime),
          unitIds: siteVisitDetail?.siteVisitUnit.map((item) => item?.unitId),
          projectIds: this.uniqueValues(
            siteVisitDetail?.siteVisitUnit.map((item) => item?.unit.projectId)
          ),
        })
        const newListUnit = [...this.state.listUnit]
        await siteVisitDetail?.siteVisitUnit.map((item) => {
          if (!this.state.listUnit?.find((unit) => unit.id === item?.unitId)) {
            newListUnit.push({
              id: item.unitId,
              name: `${item?.unit.projectCode}-${item.unit.unitName}`,
            })
          }
        })
        await this.setState({ listUnit: newListUnit })
      }
    }
  }
  uniqueValues = (nums) => [...new Set(nums)];

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
  };
  getUnit = async (keyword, projectIds?) => {
    const res = await unitService.getAllRes({
      pageSize: 10,
      keyword,
      projectIds,
      isActive: true,
    })
    const newUnit = res.items.map((i) => {
      return { id: i.id, name: `${i.projectCode}-${i.unitName}` }
    })

    await this.setState({ listUnit: newUnit })
  };

  onOk = async () => {
    const { siteVisitDetail } = this.props.siteVisitStore
    let params = await this.form.current?.validateFields()
    params = await {
      inquiryId: this.props.inquiryId,
      ...siteVisitDetail,
      ...params,
    }

    await this.props.siteVisitStore.createOrUpdate(params)
    await this.props.onOk(params)
  };
  render(): React.ReactNode {
    const {
      visible,
      onClose,
      siteVisitStore: { isLoading },
    } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          confirmLoading={isLoading}
          title={L("NEW_SITE_VISIT")}
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
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
              <Col sm={{ span: 24, offset: 0 }}>
                <FormSelect
                  rule={[{ required: true }]}
                  options={this.state.listProject}
                  selectProps={{ mode: "multiple" }}
                  label={L("PROJECT_CODE")}
                  onChange={async (ids) => {
                    await this.form.current?.resetFields(["unitIds"])
                    await this.getUnit("", ids)
                    this.setState({ listProjectChoose: ids })
                  }}
                  name={["projectIds"]}
                />
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("UNIT")}
                  name="unitIds"
                >
                  <Select
                    filterOption={false}
                    className="w-100"
                    mode="multiple"
                    onSearch={_.debounce(
                      (e) => this.getUnit(e, this.state.listProjectChoose),
                      600
                    )}
                    allowClear
                    showSearch
                  >
                    {this.renderOptions(this.state.listUnit)}
                  </Select>
                </Form.Item>
              </Col>

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
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(SiteVisitModal)
