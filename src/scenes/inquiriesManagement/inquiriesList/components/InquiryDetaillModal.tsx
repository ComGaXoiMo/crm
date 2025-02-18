import { L, LNotification } from "@lib/abpUtility"
import { Button, Col, Modal, Row } from "antd"
import React from "react"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import InquiryStore from "@stores/communication/inquiryStore"
import InfoInquiry from "./detailInquiry/infoInquiry"
import CreateTaskModal from "../../../activity/taskActivity/components/taskModal"
import DropModal from "./dropModal"
import ContactStore from "@stores/clientManagement/contactStore"
import _ from "lodash"
import AppConsts, { appPermissions, phoneRegex } from "@lib/appconst"
import UnitStore from "@stores/projects/unitStore"
import AppDataStore from "@stores/appDataStore"
const confirm = Modal.confirm

const { inquiryStatus, inquiryStatusConst } = AppConsts
interface Props {
  id: any
  visible: boolean
  onCancel: () => void
  onOk: () => void

  inquiryStore: InquiryStore
  appDataStore: AppDataStore
  contactStore: ContactStore
  unitStore: UnitStore
}

interface State {
  modalVisible: boolean
  dropModalVisible: boolean
  isEdit: boolean
  isCreateContact: boolean
  showTaskModal: boolean
  phoneCreate: any[]
  companies: any[]
  contactEmail: any[]
  contactType: number
  listProject: any[]
  iqrStages: any[]
}
@inject(
  Stores.InquiryStore,
  Stores.AppDataStore,
  Stores.ContactStore,
  Stores.UnitStore
)
@observer
class InquiriesCreateModal extends AppComponentListBase<Props, State> {
  formRef = React.createRef<any>()
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      dropModalVisible: false,
      isEdit: this.props.id ? false : true,
      isCreateContact: false,
      showTaskModal: false,
      phoneCreate: [],
      companies: [] as any,
      contactEmail: [] as any,

      contactType: 1,
      listProject: [] as any,
      iqrStages: [] as any,
    }
  }
  async componentDidMount() {
    await Promise.all([
      this.props.appDataStore.getInquirySubStage(
        this.props.inquiryStore.inquiryDetail?.statusId
      ),
    ])
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible === true) {
        if (this.props.id) {
          this.props.contactStore.resetExistContact()

          await this.props.inquiryStore.get(this.props.id).finally(() => {
            this.props.appDataStore.getInquirySubStage(
              this.props.inquiryStore.inquiryDetail?.statusId
            ),
              this.props.unitStore.getPropertyTypeByListProject(
                this.props.inquiryStore.inquiryDetail?.inquiryProjectMap?.map(
                  (item) => item.projectId
                ),
                this.props.inquiryStore.inquiryDetail?.inquiryUnitTypeMap?.map(
                  (item) => item.unitTypeId
                )
              )
            this.props.unitStore.getListUnitTypeByListProject(
              this.props.inquiryStore.inquiryDetail?.inquiryProjectMap?.map(
                (item) => item.projectId
              ),
              this.props.inquiryStore.inquiryDetail?.inquiryPropertyTypeMap?.map(
                (item) => item.propertyTypeId
              )
            )
          }),
            await this.initData()
        }
        this.setState({ isEdit: false, isCreateContact: false })
        this.getStageOption()
      } else {
        this.setState({ isEdit: false })
      }
    }
    if (this.props.id) {
      if (prevProps.id !== this.props.id) {
        const newListProject =
          this.props.inquiryStore.inquiryDetail?.inquiryProjectMap.map(
            (item) => {
              return { id: item.projectId, label: item.project?.projectCode }
            }
          )
        this.setState({ listProject: newListProject })
      }
    }
  }
  initData = async () => {
    const { inquiryDetail } = this.props.inquiryStore

    if (this.props.id) {
      this.setState({ contactEmail: inquiryDetail?.contact?.contactEmail })
      if (inquiryDetail?.contact?.companyId) {
        const otherCompany = inquiryDetail?.contact?.companyContact.map(
          (item) => {
            return { id: item?.companyId, name: item?.company?.businessName }
          }
        )
        this.setState({
          companies: [
            {
              id: inquiryDetail?.contact?.companyId,
              name: inquiryDetail?.contact?.company?.businessName,
            },
            ...otherCompany,
          ],
        })
      } else {
        if (inquiryDetail?.companyId) {
          this.setState({
            companies: [
              {
                id: inquiryDetail?.companyId,
                name: inquiryDetail?.company?.businessName,
              },
            ],
          })
        } else {
          this.setState({
            companies: [],
          })
        }
      }

      this.formRef.current.setFieldsValue({
        ...inquiryDetail,
        viewIds: inquiryDetail?.inquiryViewMap.map((item) => item.viewId),
        propertyTypeIds: inquiryDetail?.inquiryPropertyTypeMap.map(
          (item) => item.propertyTypeId
        ),
        facingIds: inquiryDetail?.inquiryFacingMap.map((item) => item.facingId),
        unitFacilityIds: inquiryDetail?.inquiryFacilityMap.map(
          (item) => item.unitFacilityId
        ),
        unitTypeIds: inquiryDetail?.inquiryUnitTypeMap.map(
          (item) => item.unitTypeId
        ),
        unitIds: inquiryDetail?.inquiryUnitMap.map((item) => item.unitId),
        projectIds: inquiryDetail?.inquiryProjectMap.map(
          (item) => item.projectId
        ),
        serviceTypeIds: inquiryDetail?.inquiryServiceTypeMap.map(
          (item) => item.serviceTypeId
        ),
      })
      if (
        inquiryDetail.statusId === inquiryStatus.confirmed.id ||
        inquiryDetail.statusId === inquiryStatus.dropped.id
      ) {
        this.formRef.current?.setFieldValue("statusId", inquiryDetail.statusId)
      }
    } else {
      this.formRef.current.resetFields()
    }
  }
  //action for this Drawer
  handleEdit = () => {
    this.setState({ isEdit: true })
  }

  handleSave = async (id?) => {
    const {
      contactStore: { checkContact },
      inquiryStore: { inquiryDetail },
    } = this.props
    const formValues = await this.formRef.current?.validateFields()
    let res = {
      ...formValues,
      companyId: formValues?.companyId,
      contactId: checkContact?.id ?? inquiryDetail?.contactId,
      contact: {
        ...formValues.contact,
        id: checkContact?.id ?? inquiryDetail?.contactId,
        contactPhone: this.state.phoneCreate,
      },
    }

    if (Array.isArray(res.contact?.contactAddress)) {
      res = {
        ...res,
        contact: {
          ...res.contact,
          contactAddress: res.contact?.contactAddress[0],
        },
      }
    }
    if (Array.isArray(res.inquiryAddress)) {
      res = { ...res, inquiryAddress: res.inquiryAddress[0] }
    }

    if (id) {
      res = {
        ...res,
        id: id,
        // contactId: inquiryDetail?.contact?.id,
        // contact: { ...res.contact, id: inquiryDetail.contact?.id },
      }
    } else {
      res = {
        ...res,
        companyId: formValues.contact?.companyId,
      }
    }
    await this.props.inquiryStore.createOrUpdate(res)

    await this.props.onOk()
    this.setState({ isEdit: false })
    if (!id) {
      this.handleClose()
    } else {
      await this.props.inquiryStore.get(id)
      await this.initData()
    }
  }

  getStageOption = async () => {
    const value = await this.props.appDataStore.inquiryStatus.filter((item) => {
      if (
        item.id !== inquiryStatus.confirmed.id &&
        item.id !== inquiryStatus.dropped.id
      ) {
        return item
      }
    })
    if (
      this.props.inquiryStore.inquiryDetail?.statusId ===
        inquiryStatus.confirmed.id ||
      this.props.inquiryStore.inquiryDetail?.statusId ===
        inquiryStatus.dropped.id
    ) {
      value.push({
        id: this.props.inquiryStore.inquiryDetail?.statusId,
        name: this.props.inquiryStore.inquiryDetail?.status?.name,
      })
    }
    await this.setState({ iqrStages: value })
  }
  handleClose = () => {
    this.formRef.current.resetFields()
    this.props.contactStore.resetExistContact()
    this.props.onCancel()
  }
  handleChangeStatus = () => {
    this.props.onOk()
    this.props.onCancel()
  }
  //action for detail modal
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    this.toggleModal()
    await this.props.onOk()
  }
  toggleDropModal = () =>
    this.setState((prevState) => ({
      dropModalVisible: !prevState.dropModalVisible,
    }))

  MarkConfirmed = () => {
    confirm({
      title: LNotification("ARE_YOU_WANT_TO_CONFIRM"),
      // content: LNotification("."),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await this.props.inquiryStore.UpdateComplete(this.props.id)
        await this.handleChangeStatus()
      },
    })
  }

  handleDropOk = async (value) => {
    await this.props.inquiryStore.UpdateDrop({
      statusDetailId: value,
      id: this.props.id,
    })
    await this.toggleDropModal()
    await this.handleChangeStatus()
  }
  clearFormOtherPhoneNumber = async () => {
    const ref = await this.formRef.current?.getFieldValue([
      "contact",
      "contactPhone",
    ])

    await this.formRef.current?.resetFields(["contact"])
    await this.formRef.current?.setFieldValue(["contact", "contactPhone"], ref)
  }
  checkIsExistPhone = async (value) => {
    if (phoneRegex.test(value?.phone)) {
      this.setState({ phoneCreate: [value] })
      await this.props.contactStore.checkExistContact({ phone: value?.phone })
      const { checkContact } = this.props.contactStore
      await this.setState({ contactType: checkContact?.typeId ?? 1 })
      if (!this.props.contactStore.checkContact) {
        await this.clearFormOtherPhoneNumber()
        await this.setState({ isEdit: true, isCreateContact: true })
      } else if (checkContact?.isOwner === true) {
        this.formRef.current?.setFieldsValue({
          contact: checkContact,
          companyId: checkContact.companyId,
        })

        const otherCompany = checkContact?.companyContact.map((item) => {
          return {
            id: item?.companyId,
            name: item?.company?.businessName,
            levelId: item?.levelId,
            title: item?.title,
          }
        })
        await this.setState({
          companies: [
            {
              id: checkContact.companyId,
              name: checkContact.company?.businessName,
            },
            ...otherCompany,
          ],
          contactEmail: checkContact?.contactEmail,
        })
        await this.setState({ isEdit: true, isCreateContact: false })
      } else if (checkContact?.isOwner === false) {
        this.clearFormOtherPhoneNumber()
        if (this.props.id) {
          await this.setState({ isCreateContact: false })
        } else {
          await this.setState({ isEdit: false, isCreateContact: false })
        }
      }
    } else {
      this.setState({ isCreateContact: false })
    }
  }

  render(): React.ReactNode {
    const {
      appDataStore: { inquiryStatus },
      inquiryStore: { inquiryDetail, isLoading },
      visible,
    } = this.props
    // const { checkContact } = this.props.contactStore;
    const canEdit =
      inquiryDetail?.statusId !== inquiryStatusConst.confirmed &&
      inquiryDetail?.statusId !== inquiryStatusConst.dropped
    return (
      <>
        <CustomDrawer
          useBottomAction
          title={this.props.id ? inquiryDetail?.inquiryName : ""}
          visible={visible}
          onEdit={
            this.props.id &&
            (canEdit || this.isGranted(appPermissions.inquiry.fullEdit))
              ? this.handleEdit
              : undefined
          }
          onCreate={this.props.id ? undefined : () => this.handleSave()}
          onClose={this.handleClose}
          onSave={() => this.handleSave(this.props.id)}
          isEdit={this.state.isEdit}
          updatePermission={this.isGranted(appPermissions.inquiry.update)}
          isLoading={isLoading}
        >
          <Row
            className="h-100"
            gutter={[0, 0]}
            style={{ fontSize: 12, overflow: "hidden" }}
          >
            {this.props.id && (
              <div className="flex between-content w-100">
                <div className="wrap arrow-steps">
                  {inquiryStatus.map((inquiry, index) => (
                    <div
                      key={index}
                      className={
                        inquiryDetail?.statusId === inquiry?.id
                          ? "step current"
                          : "step"
                      }
                    >
                      <strong>{inquiry.name}</strong>
                    </div>
                  ))}
                </div>

                {inquiryDetail?.statusId !== 4 &&
                  inquiryDetail?.statusId !== 5 && (
                    <div>
                      <Button
                        onClick={() => this.MarkConfirmed()}
                        size="small"
                        style={{
                          borderRadius: "5px",
                          height: "100%",
                          color: "#ffffff",
                          backgroundColor: "#1591d8",
                        }}
                      >
                        <>{this.L("MARK_COMPLETED")}</>
                      </Button>
                      <Button
                        size="small"
                        onClick={() => this.toggleDropModal()}
                        style={{
                          borderRadius: "5px",
                          height: "100%",
                          color: "#ffffff",
                          backgroundColor: "#CC3300",
                        }}
                      >
                        <>{this.L("MARK_DROPPED")}</>
                      </Button>
                    </div>
                  )}
              </div>
            )}
            <Col className="h-100" span={24}>
              <InfoInquiry
                formRef={this.formRef}
                id={this.props.id}
                visible={this.props.visible}
                contactType={this.state.contactType}
                isEdit={this.state.isEdit}
                isCreateContact={this.state.isCreateContact}
                onCheckPhone={this.checkIsExistPhone}
                companies={this.state.companies}
                contactEmail={this.state.contactEmail}
                listProject={this.state.listProject}
                listIqrStage={this.state.iqrStages}
              />
            </Col>
          </Row>

          <CreateTaskModal
            visible={this.state.modalVisible}
            onClose={() => {
              this.setState({ modalVisible: false })
              this.setState(null)
            }}
            onOk={this.handleOk}
          />
          <DropModal
            visible={this.state.dropModalVisible}
            onClose={() => {
              this.setState({ dropModalVisible: false })
            }}
            onOk={(value) => this.handleDropOk(value)}
          />
        </CustomDrawer>
      </>
    )
  }
}
export default withRouter(InquiriesCreateModal)
