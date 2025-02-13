import React from "react"
import { Card, Col, Form, Input, InputNumber, Row, Select } from "antd"
import _ from "lodash"
import rules from "./validation"
import { validateMessages } from "@lib/validation"
import { L } from "@lib/abpUtility"
import projectService from "@services/projects/projectService"
import { filterOptions, renderOptions } from "@lib/helper"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import AppConsts, { moduleNames } from "@lib/appconst"
import AppDataStore from "@stores/appDataStore"
import UnitStore from "@stores/projects/unitStore"
import TextArea from "antd/lib/input/TextArea"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import CurrencyInput from "@components/Inputs/CurrencyInput"
import FormSelect from "@components/FormItem/FormSelect"
import ImageUploadWrapCRM from "@components/FileUpload/ImageUploadCRM"
import FileStore from "@stores/common/fileStore"

const { formVerticalLayout } = AppConsts
type Props = {
  id: any
  fileStore: FileStore
  unitStore: UnitStore
  appDataStore: AppDataStore
  formRef: any
  isEdit: any
  visible: boolean
}
type State = {
  projects: any[]
  projectId: any
  isEdit: any
  floorResult: any[]
  unitViews: any[]
}
@inject(Stores.AppDataStore, Stores.UnitStore, Stores.FileStore)
@observer
class UnitInfo extends AppComponentListBase<Props, State> {
  formRef: any = this.props.formRef
  constructor(props) {
    super(props)

    this.state = {
      projects: [],
      projectId: null,
      floorResult: [],
      isEdit: false,
      unitViews: [] as any,
    }
  }
  componentDidMount = async () => {
    await this.getProject("")
    await this.getDetail(this.props?.id)
    await this.getFloorResult(this.props.unitStore.editUnitRes?.projectId)
  }
  componentDidUpdate = async (prevProps) => {
    if (prevProps.visible !== this.props?.visible) {
      await this.formRef.current?.resetFields()
      if (this.props?.visible) {
        await this.getProject("")
        await this.getFloorResult(this.props.unitStore.editUnitRes?.projectId)
        await this.getDetail(this.props?.id)
        // let callAPI = Promise.all([this.getDetail(this.props?.id)]);
        // callAPI.finally(() => this.setState({}));
        if (this.props?.id) {
          this.setState({ isEdit: false })
        } else {
          this.setState({ isEdit: true })
        }
      }
    }
  }

  getProject = async (keyword) => {
    const res = await projectService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword,
      isActive: true,
    })
    this.setState({
      projects: res.items.map((i) => {
        return { id: i.id, name: i.projectName }
      }),
    })
  }

  getPropertyType = (id?) => {
    this.props.unitStore.getProjectPropertyType(id)
  }
  getUnitType = async (projectId?, productTypeId?) => {
    await this.props.unitStore.getListUnitTypeByProject(
      projectId,
      productTypeId
    )
  }
  getFloorResult = async (id, keyword?) => {
    const res = await projectService.getFloors(id, {
      pageSize: 20,
      pageNumber: 1,
      keyword,
    })
    this.setState({ floorResult: res })
  }

  getDetail = async (id?) => {
    if (id) {
      this.formRef.current.setFieldsValue({
        ...this.props.unitStore.editUnitRes,
        viewIds: this.props.unitStore?.editUnitRes?.unitViewMap?.map(
          (item) => item.viewId
        ),
        unitFacilityIds: this.props.unitStore?.editUnitRes?.unitFacilityMap.map(
          (item) => item.unitFacilityId
        ),
      })

      this.setState({
        projects: [
          {
            id: this.props.unitStore.editUnitRes?.projectId,
            name: this.props.unitStore.editUnitRes?.projectName,
          },
        ],
      })
      this.setState({ projectId: this.props.unitStore.editUnitRes?.projectId })
    } else {
      await this.props.unitStore.createUnit()
    }
  }

  render() {
    const {
      projects,
      //  projectId,
      floorResult,
    } = this.state
    const {
      appDataStore: { unitStatus, unitFacilities },
      unitStore: { view, facing, projectPropertyType, unitTypeByProject },
    } = this.props

    return (
      <Form
        ref={this.formRef}
        layout={"vertical"}
        validateMessages={validateMessages}
        disabled={!this.props.isEdit}
      >
        <Card bordered={false} className="card-detail-modal">
          <Row gutter={[8, 0]}>
            <Col sm={{ span: 8, offset: 0 }}>
              <Form.Item
                label={L("UNIT_PROJECT")}
                name="projectId"
                rules={rules.required}
                {...formVerticalLayout}
              >
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showSearch
                  disabled={!this.props.isEdit}
                  allowClear
                  filterOption={false}
                  className="full-width"
                  onChange={(e) => {
                    if (!e) {
                      this.setState({ projectId: null })
                      return
                    }
                    this.setState({ projectId: e })
                    this.getFloorResult(e, "")
                    this.getPropertyType(e)
                    this.formRef.current?.resetFields([
                      "productTypeId",
                      "unitTypeId",
                      "floorId",
                    ])
                  }}
                  onSearch={_.debounce((e) => this.getProject(e), 1000)}
                >
                  {renderOptions(projects)}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormSelect
                rule={rules.required}
                options={projectPropertyType}
                disabled={!this.props.isEdit}
                label={L("PRODUCT_TYPE")}
                name={"productTypeId"}
                onChange={(e) => {
                  this.getUnitType(this.state.projectId, e)
                  this.formRef.current?.resetFields(["unitTypeId"])
                }}
              />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormSelect
                rule={rules.required}
                options={unitTypeByProject}
                disabled={!this.props.isEdit}
                label={L("UNIT_TYPE")}
                name="unitTypeId"
              />
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <Form.Item
                label={L("UNIT_NO")}
                {...formVerticalLayout}
                name="unitName"
                rules={rules.unitName}
              >
                <Input disabled={!this.props.isEdit} />
              </Form.Item>
            </Col>

            <Col sm={{ span: 8, offset: 0 }}>
              <Form.Item
                label={L("UNIT_STATUS")}
                {...formVerticalLayout}
                name="statusId"
                rules={rules.statusId}
              >
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showSearch
                  allowClear
                  disabled={!this.props.isEdit}
                  filterOption={filterOptions}
                  className="full-width"
                >
                  {renderOptions(unitStatus)}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <Form.Item
                // rules={rules.required}
                label={L("UNIT_FLOOR")}
                {...formVerticalLayout}
                name="floorId"
              >
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showSearch
                  disabled={!this.props.isEdit}
                  allowClear
                  filterOption={filterOptions}
                  className="full-width"
                  // disabled={ projectId ? false : true}
                >
                  {renderOptions(floorResult)}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <Form.Item
                label={L("UNIT_SIZE")}
                {...formVerticalLayout}
                name="actualSize"
                rules={rules.size}
              >
                <InputNumber
                  maxLength={9}
                  className="w-100"
                  min={0}
                  disabled={!this.props.isEdit}
                />
              </Form.Item>
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <Form.Item
                label={L("BALCONY")}
                {...formVerticalLayout}
                name="balcony"
              >
                <InputNumber
                  maxLength={9}
                  min={0}
                  disabled={!this.props.isEdit}
                  className="w-100"
                />
              </Form.Item>
            </Col>

            <Col sm={{ span: 8, offset: 0 }}>
              <Form.Item
                label={L("ASKING_RENT")}
                {...formVerticalLayout}
                name="askingRent"
              >
                <CurrencyInput disabled={!this.props.isEdit} />
              </Form.Item>
            </Col>
            <Col sm={{ span: 16, offset: 0 }}>
              <Form.Item
                label={L("UNIT_VIEW")}
                {...formVerticalLayout}
                name={["viewIds"]}
              >
                <Select
                  showSearch
                  showArrow
                  allowClear
                  disabled={!this.props.isEdit}
                  filterOption={filterOptions}
                  className="full-width"
                  mode="multiple"
                >
                  {renderOptions(view)}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={{ span: 8, offset: 0 }}>
              <FormSelect
                options={facing}
                label={L("UNIT_FACING")}
                disabled={!this.props.isEdit}
                name="facingId"
                // rule={rules.required}
              />
            </Col>

            <Col sm={{ span: 24, offset: 0 }}>
              <FormSelect
                label={L("UNIT_FACILITIES")}
                disabled={!this.props.isEdit}
                selectProps={{ mode: "multiple" }}
                name={"unitFacilityIds"}
                options={unitFacilities}
              />
            </Col>

            <Col sm={{ span: 24, offset: 0 }}>
              <Form.Item
                label={L("UNIT_DESCRIPTION")}
                {...formVerticalLayout}
                name="description"
                rules={rules.description}
              >
                <TextArea disabled={!this.props.isEdit} rows={3} />
              </Form.Item>
            </Col>
            {this.props.id !== 0 && (
              <Col sm={{ span: 24, offset: 0 }}>
                <p>{L("UNIT_IMAGE")}</p>
                <ImageUploadWrapCRM
                  moduleId={moduleNames.unit}
                  parentId={this.props.unitStore?.editUnitRes?.uniqueId}
                  fileStore={this.props.fileStore || new FileStore()}
                  type="IMAGE"
                />
              </Col>
            )}
            {/* {this.props.id && (
              <>
                <Col style={{ marginTop: 5 }} sm={{ span: 24, offset: 0 }}>
                  <strong>{L("STATUS_INFO")}</strong>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <TabStatus />
                </Col>
              </>
            )} */}
          </Row>
        </Card>
      </Form>
    )
  }
}

export default withRouter(UnitInfo)
