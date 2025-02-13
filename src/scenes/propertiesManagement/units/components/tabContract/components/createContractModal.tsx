import React from "react"
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  Tag,
} from "antd"
import _, { debounce } from "lodash"
import { L } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import UnitStore from "@stores/projects/unitStore"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import FormSelect from "@components/FormItem/FormSelect"
import FormInput from "@components/FormItem/FormInput"
import FormDatePicker from "@components/FormItem/FormDatePicker"
import FormNumber from "@components/FormItem/FormNumber"
import { validateMessages } from "@lib/validation"
import {
  filterOptions,
  inputCurrencyFormatter,
  inputNumberFormatter,
  renderOptions,
} from "@lib/helper"
import InquiryStore from "@stores/communication/inquiryStore"
import ContactStore from "@stores/clientManagement/contactStore"
import AppConsts, { dateDifference } from "@lib/appconst"

import dayjs from "dayjs"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import UserStore from "@stores/administrator/userStore"
// import OtherFeesTable from "@scenes/leaseContractsManagement/lease/components/leaseDetailComponent/SCFeeTable";
import AddUnitModal from "@scenes/leaseContractsManagement/lease/components/leaseInfoModal/components/addUnitModal"
import UnitStatusModal from "@scenes/leaseContractsManagement/lease/components/leaseInfoModal/components/unitStatusModal"
import AppDataStore from "@stores/appDataStore"
import SessionStore from "@stores/sessionStore"
import ReservationStore from "@stores/activity/reservationStore"
import FeeRentTable from "@scenes/leaseContractsManagement/lease/components/leaseDetailComponent/feeRentTable"
import DiscountFeeTable from "@scenes/leaseContractsManagement/lease/components/leaseDetailComponent/discountFeeTable"
import EditCompanyModal from "./editCompanyModal/editCompanyModal"
import { ExclamationCircleFilled } from "@ant-design/icons"
import TextArea from "antd/lib/input/TextArea"
import OtherFeeWithAdd from "@scenes/leaseContractsManagement/lease/components/leaseDetailComponent/otherFeeWithAdd"
import OccupierSelect from "@components/Select/OccupierSelect"
const {
  paymentTerm,
  align,
  roles,
  positionUser,
  // leaseStage,
  unitReservationStatus,
} = AppConsts
type Props = {
  unitStore: UnitStore
  inquiryStore: InquiryStore
  appDataStore: AppDataStore
  userStore: UserStore
  contactStore: ContactStore
  leaseAgreementStore: LeaseAgreementStore
  reservationStore: ReservationStore

  sessionStore: SessionStore
  visible: boolean
  onClose: () => void
  onOk: () => Promise<any>
}
type State = {
  companies: any[]
  companyLegals: any[]
  unitModalVisible: boolean
  editingKey: any
  leaseTerm: any
  dataOtherFee: any[]
  paymentForYearData: any[]
  discountData: any[]
  otherFeeData: any[]
  listAdmin: any[]
  listReservationUnit: any[]
  unitId: any[]
  addUnitModalVisible: boolean
  editCompanyVisible: boolean
  otherFeeDate: any
  dataTableReservation: any[]
  paymetnDate: any
  rateUSD: number
  totalOtherFees: any
  myPriority: number
  paymentTermChoose: any
  headerContractAmount: number
  hasRent: boolean
  feeRentOption: any[]
}
@inject(
  Stores.InquiryStore,
  Stores.UnitStore,
  Stores.UserStore,
  Stores.ContactStore,
  Stores.AppDataStore,
  Stores.ReservationStore,
  Stores.LeaseAgreementStore,
  Stores.SessionStore
)
@observer
class CreateContractModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()
  constructor(props) {
    super(props)
    this.state = {
      companies: [] as any,
      companyLegals: [] as any,
      dataOtherFee: [] as any,
      discountData: [] as any,
      paymentForYearData: [] as any,
      otherFeeData: [] as any,
      editingKey: "",
      unitModalVisible: false,
      leaseTerm: {} as any,
      listAdmin: [] as any,
      addUnitModalVisible: false,
      editCompanyVisible: false,
      unitId: [] as any,
      otherFeeDate: {} as any,
      paymetnDate: dayjs(),
      dataTableReservation: [] as any,
      listReservationUnit: [] as any,
      rateUSD: 0,
      totalOtherFees: undefined,
      paymentTermChoose: undefined,
      myPriority: 1,
      headerContractAmount: 0,
      feeRentOption: [] as any,
      hasRent: false,
    }
  }
  componentDidUpdate = async (
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ) => {
    if (prevState.paymentForYearData !== this.state.paymentForYearData) {
      const feeRentOption = this.state.paymentForYearData.map((item) => {
        return {
          id: item?.uniqueId,
          label: item?.name,
          startDate: dayjs(item?.startDate).toJSON(),
          endDate: dayjs(item?.endDate).toJSON(),
        }
      })

      this.setState({ feeRentOption })
    }
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        const { inquiryDetail } = this.props.inquiryStore
        await this.getContact("")
        this.getAdmin("")
        this.getListInquiry("")
        this.setState({
          myPriority: 1,
          unitId: [],
        })
        await this.props.inquiryStore.getSimpleInquiry({
          id: inquiryDetail?.id,
        })

        if (inquiryDetail?.contactId) {
          await this.props.contactStore.addToListSimpleContact({
            id: inquiryDetail?.contact?.id,
            name: inquiryDetail?.contact?.contactName,
            company: [
              {
                id: inquiryDetail?.companyId,
                name: inquiryDetail?.company?.businessName,
              },
            ],
          })

          await this.getCompany(inquiryDetail?.company)
        }
        this.formRef.current?.setFieldsValue({
          ...inquiryDetail,
          inquiryId: inquiryDetail.id,
          statusId: undefined,
          moveInDate: dayjs(inquiryDetail?.moveInDate),
        })
        await this.addToListReservationUnit(inquiryDetail?.id)
      }
    }
  }
  getListInquiry = async (keyword) => {
    this.props.inquiryStore.getSimpleInquiry({
      keyword: keyword,
      isActive: true,
      isExcludeInquiryLA: true,
      maxResultCount: 10,
      skipCount: 0,
    })
  }

  getAdmin = async (keyword) => {
    await this.props.userStore.getAll({
      maxResultCount: 10,
      skipCount: 0,
      roleId: roles.admin,
      keyword: keyword,
    })
    const lsitUser = [...this.props.userStore.users.items]

    lsitUser.map((i) => {
      return { id: i.id, name: i.name }
    })
    this.setState({ listAdmin: lsitUser })
  }

  handleSearchAdmin = debounce((keyword) => {
    this.getAdmin(keyword)
  }, 400)
  getContact = async (keyword?) => {
    this.props.contactStore.getSimpleContact({
      keyword: keyword,
      isActive: true,
      maxResultCount: 10,
      skipCount: 0,
    })
  }
  getCompany = async (company?) => {
    const listCompany = [{ id: company?.id, name: company?.businessName }]
    const listCompanyLegal = [{ id: company?.id, name: company?.legalName }]
    this.setState({ companies: listCompany })
    this.setState({ companyLegals: listCompanyLegal })
  }

  changeOccupier = async (value) => {
    const occPrimary = (value ?? []).find(
      (item: any) => item?.isPrimary === true
    )
    if (occPrimary) {
      this.formRef.current?.setFieldValue(
        "occupier",
        occPrimary?.userTenant?.name
      )
    }
  }

  toggleModal = () =>
    this.setState((prevState) => ({
      unitModalVisible: !prevState.unitModalVisible,
    }))
  toggleAddUnitModal = () =>
    this.setState((prevState) => ({
      addUnitModalVisible: !prevState.addUnitModalVisible,
    }))

  onOKEditCompany = async (data) => {
    this.getCompany(data)
    await this.toggleCompanyModal()
  }
  toggleCompanyModal = () =>
    this.setState((prevState) => ({
      editCompanyVisible: !prevState.editCompanyVisible,
    }))
  isChooseUnit = async (value) => {
    await this.props.unitStore.get(value[0])
    await this.formRef.current?.setFieldValue(
      "unitInfo",
      `${this.props.unitStore.editUnit?.projectCode} - ${this.props.unitStore.editUnit?.unitName}`
    )

    await this.setState({
      unitId: [
        {
          unitId: value[0],
          unit: {
            unitName: this.props.unitStore.editUnit?.unitName,
            projectName: this.props.unitStore.editUnit?.projectName,
          },
          projectId: this.props.unitStore.editUnit?.projectId,
        },
      ],
    })
    this.renderDataReservation(value[0])
    await this.toggleAddUnitModal()
  }

  onChangeUnitReservation = async (value) => {
    await this.props.unitStore.get(value)
    await this.setState({
      unitId: [
        {
          unitId: value,
          unit: {
            unitName: this.props.unitStore.editUnit?.unitName,
            projectName: this.props.unitStore.editUnit?.projectName,
          },
          projectId: this.props.unitStore.editUnit?.projectId,
        },
      ],
    })
    await this.renderDataReservation(value)
    const myRes = this.state.dataTableReservation.find(
      (item) =>
        item.inquiryId === this.formRef.current?.getFieldValue("inquiryId") &&
        item.reservationUnit.find((unit) => unit.unitId === value)
    )
    this.setState({
      myPriority: myRes?.reservationUnit.find((unit) => unit.unitId === value)
        ?.number,
    })
  }
  renderDataReservation = async (unitId?) => {
    await this.props.reservationStore.getMoreAll(
      {
        maxResultCount: 30,
        skipCount: 0,
        unitId: unitId,
        statusIds: [unitReservationStatus.new],
        unitOrder: true,
      },
      this.formRef.current?.getFieldValue("inquiryId")
    )
    if (!this.formRef.current?.getFieldValue("inquiryId")) {
      await this.props.reservationStore.removeDataTable()
    }
    await this.setState({
      dataTableReservation: [
        ...this.props.reservationStore.tableData?.items,
        ...this.props.reservationStore.moreReservations,
      ],
    })
    const reservationId = this.props.reservationStore.tableData?.items.find(
      (item) => item.reservationUnit?.find((unit) => unit.unitId === unitId)
    )?.id
    this.formRef.current?.setFieldValue("reservationId", reservationId)
  }

  setValueForLeaseTerm = async () => {
    const startDate = this.formRef.current?.getFieldValue("commencementDate")
    const endDate = this.formRef.current?.getFieldValue("expiryDate")

    if (startDate && endDate) {
      const res = await dateDifference(
        dayjs(startDate).endOf("days"),
        dayjs(endDate).endOf("days").add(1, "days")
      )
      const leaseTerm = `${res?.years} year(s), ${res?.months} month(s), ${res?.days} day(s)`
      await this.setState({
        leaseTerm: {
          ...res,
          startDate: dayjs(startDate).toJSON(),
          endDate: dayjs(endDate).toJSON(),
        },
      })
      await this.setState({
        otherFeeDate: {
          startDate: startDate,
          endDate: endDate,
        },
      })
      await this.formRef.current?.setFieldValue("leaseTerm", leaseTerm)
    }
  }
  addToListReservationUnit = async (inquiryId) => {
    const listReservationUnit = [] as any
    const reservationList = await this.props.reservationStore.getAll({
      maxResultCount: 30,
      skipCount: 0,
      inquiryId: inquiryId,
      statusIds: [unitReservationStatus.new, unitReservationStatus.close],
      unitOrder: true,
    })
    await reservationList?.items?.map((item) => {
      item.reservationUnit?.map((resUnit) => {
        listReservationUnit.push({
          id: resUnit.unitId,
          name: `${resUnit?.unit.projectCode} - ${resUnit?.unit.unitName}`,
        })
      })
    })
    await this.setState({ listReservationUnit: listReservationUnit })
    if (inquiryId) {
      await this.setState({
        dataTableReservation: this.props.reservationStore.tableData?.items,
      })
    }
  }
  isEditing = (record: any) => record.key === this.state.editingKey

  onSave = async () => {
    if (!this.state.hasRent) {
      Modal.warning({
        title: L("LA_RENT_IS_NOT_MATCH"),
        content: L("REVIEW_RENT_OF_THIS_LA"),
      })
    } else if (this.state.myPriority !== 1) {
      Modal.warning({
        title: L("CANNOT_CREATE_LA_REQUEST"),
        content: L("ONLY_UNIT_OF_RESERVATION_WITH_PROROTY_1"),
      })
    } else {
      const formValues = await this.formRef.current?.validateFields()
      const leaseTerm = await dateDifference(
        dayjs(formValues?.commencementDate).endOf("days"),
        dayjs(formValues?.expiryDate).endOf("days").subtract(1, "days")
      )
      const res = {
        ...formValues,
        // stageId: leaseStage.new,
        isRequest: true,
        leaseTermYear: leaseTerm.years,
        leaseTermMonth: leaseTerm.months,
        leaseTermDay: leaseTerm.days,
        leaseAgreementDetails: [
          ...this.state.paymentForYearData,
          ...this.state.otherFeeData,
        ],
        leaseAgreementUnit: this.state.unitId,
        leaseAgreementDiscount: [...this.state.discountData],
        leaseAgreementUserIncharge: this.formRef.current?.getFieldValue(
          "adminId"
        )
          ? [
              {
                userId: this.props.sessionStore?.currentLogin.user?.id,
                positionId: positionUser.dealer,
              },
              {
                userId: this.formRef.current?.getFieldValue("adminId"),
                positionId: positionUser.admin,
              },
            ]
          : [
              {
                userId: this.props.sessionStore?.currentLogin.user?.id,
                positionId: positionUser.dealer,
              },
            ],
        leaseAgreementUserTenant: formValues?.leaseAgreementUserTenant?.filter(
          (item) => item?.userTenantId
        ),
      }
      await this.props.leaseAgreementStore.createOrUpdate(res)
      this.props.onOk()
    }
  }

  dataPaymentChange = async (data) => {
    this.setState({ paymentForYearData: data })

    let totalAmount = 0
    let totalAmountInclVat = 0
    await data.map((item) => {
      totalAmount = totalAmount + item?.totalAmount
      totalAmountInclVat = totalAmountInclVat + item?.totalAmountIncludeVat
    })

    await this.formRef.current?.setFieldValue("contractAmount", totalAmount)
    await this.formRef.current?.setFieldValue(
      "contractAmountIncludeVat",
      totalAmountInclVat
    )
    this.formRef.current?.setFieldValue(
      "contractAmountAfterDiscount",
      totalAmountInclVat
    )
    this.formRef.current?.setFieldValue(
      "contractAmountAfterDiscountExcludeVat",
      totalAmount
    )
    this.setState({
      headerContractAmount: totalAmount,
    })
  }
  checkFullRent = (value) => {
    this.setState({ hasRent: value })
  }
  dataOtherFeeChange = async (data) => {
    let totalInclVat = 0
    await data?.map((item) => {
      totalInclVat = totalInclVat + item?.amountIncludeVat
    })
    let totalExclVat = 0
    await data?.map((item) => {
      totalExclVat = totalExclVat + item?.amount
    })
    await this.setState({
      otherFeeData: data,
      totalOtherFees: data,
    })
  }
  dataDiscountChange = (data) => {
    this.setState({ discountData: data })

    const lasItem = { ...data[data.length - 1] }
    if (lasItem?.contractRentAfterDiscountIncludeVat) {
      this.formRef.current?.setFieldValue(
        "contractAmountAfterDiscount",
        lasItem?.contractRentAfterDiscountIncludeVat
      )
      this.formRef.current?.setFieldValue(
        "contractAmountAfterDiscountExcludeVat",
        lasItem?.contractRentAfterDiscountExcludeVat
      )
      this.setState({
        headerContractAmount: lasItem?.contractRentAfterDiscountExcludeVat,
      })
    } else {
      this.formRef.current?.setFieldValue(
        "contractAmountAfterDiscount",
        this.formRef.current?.getFieldValue("contractAmountIncludeVat")
      )
      this.formRef.current?.setFieldValue(
        "contractAmountAfterDiscountExcludeVat",
        this.formRef.current?.getFieldValue("contractAmount")
      )
      this.setState({
        headerContractAmount:
          this.formRef.current?.getFieldValue("contractAmount"),
      })
    }
  }
  render() {
    const { companies, companyLegals } = this.state
    const {
      visible,
      onClose,
      leaseAgreementStore: { isLoading },
      // appDataStore: { leaseAgreementStatus },
      inquiryStore: { listInquirySimple },
      contactStore: { listContactSimple },
    } = this.props
    const disabledExpriDateDate = (current) => {
      return (
        current &&
        current <
          dayjs(
            this.formRef.current?.getFieldValue("commencementDate")
          ).startOf("days")
      )
    }
    const columns = [
      {
        title: L("INQUIRY_NAME"),
        dataIndex: "inquiry",
        key: "inquiry",
        width: 200,
        ellipsis: false,
        render: (inquiry: any) => <> {inquiry?.inquiryName}</>,
      },
      {
        title: L("LA_RESERVATION"),
        dataIndex: "description",
        key: "description",
        width: 180,
        ellipsis: false,
        render: (description: any) => <>{description}</>,
      },
      {
        title: L("PROJECT"),
        dataIndex: "project",
        key: "project",
        width: 100,
        ellipsis: true,
        render: (project, row) => (
          <>{row?.reservationUnit[0]?.unit?.projectCode}</>
        ),
      },
      {
        title: L("UNIT"),
        dataIndex: "reservationUnit",
        key: "reservationUnit",
        width: 150,
        align: align.left,
        ellipsis: false,
        render: (reservationUnit: any) =>
          reservationUnit?.map((item, index) => {
            return (
              <Tag
                key={index}
                color={
                  item.unitId === this.state.unitId[0]?.unitId
                    ? "purple"
                    : "default"
                }
              >{`${item.unit?.unitName} `}</Tag>
            )
          }),
      },
      {
        title: L("RESERVATION_EXPIRY_DATE"),
        dataIndex: "expiryDate",
        key: "expiryDate",
        align: align.center,
        width: 150,
        ellipsis: false,
        render: this.renderDate,
      },
      {
        title: L("PRIORITY"),
        dataIndex: "priority",
        key: "priority",
        width: 60,
        align: align.center,
        ellipsis: false,
        render: (priority, item) =>
          this.state.dataTableReservation
            .find((reservation) => reservation.id === item?.id)
            ?.reservationUnit.find(
              (unit) => unit.unitId === this.state.unitId[0]?.unitId
            )?.number,
      },

      {
        title: L("DEALER"),
        dataIndex: "creatorUser",
        key: "creatorUser",
        width: 140,
        ellipsis: false,
        render: (creatorUser: any) => creatorUser?.displayName,
      },
    ]

    return (
      <Modal
        open={visible}
        width={"99%"}
        style={{ top: 20 }}
        destroyOnClose
        maskClosable={false}
        title={
          <>
            <Row gutter={[12, 0]} className="w-100">
              <Col sm={{ span: 4 }} className="form-item-highlight">
                {L("REQUEST_TO_LEASE_AGREEMENT")}
              </Col>
              <Col sm={{ span: 6 }} className="item-header-drawer">
                <span>{L("CURRENT_LA_AMOUNT_EXCL_VAT")}</span>
              </Col>
              <Col sm={{ span: 3 }} className="form-item-highlight-2">
                <InputNumber
                  min={0}
                  className="w-100"
                  value={this.state.headerContractAmount}
                  formatter={(value) => inputCurrencyFormatter(value)}
                  disabled
                />
              </Col>
            </Row>
          </>
        }
        cancelText={L("BTN_CANCEL")}
        onCancel={() => {
          onClose()
        }}
        onOk={this.onSave}
        confirmLoading={isLoading}
      >
        <Form
          ref={this.formRef}
          layout={"vertical"}
          validateMessages={validateMessages}
          size="middle"
        >
          <Card bordered={false} className="card-detail-modal">
            <Row gutter={[8, 0]} className="w-100">
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("INQUIRY")} name="inquiryId">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    filterOption={filterOptions}
                    className="full-width"
                    disabled
                  >
                    {renderOptions(listInquirySimple)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 16, offset: 0 }}>
                <FormInput
                  rule={[
                    {
                      required: false,
                    },
                    { max: 50 },
                  ]}
                  label="REFERENCE_NUMBER"
                  name={"referenceNumber"}
                />
              </Col>
              {/* <Col sm={{ span: 8 }}>
                <FormSelect
                  options={leaseAgreementStatus?.filter(
                    (item) => item?.parentId === leaseStage.new
                  )}
                  label={L("LA_STATUS")}
                  name="statusId"
                  rule={[{ required: true }]}
                />
              </Col> */}
              <Col sm={{ span: 8 }}>
                <FormNumber
                  label={L("DEPOSIT_AMOUNT")}
                  name="depositAmount"
                  rule={[{ required: true }]}
                />
              </Col>
              <Col sm={{ span: 6 }}>
                <Form.Item
                  label={L("CONTACT")}
                  name="contactId"
                  rules={[{ required: true }]}
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    disabled
                    filterOption={filterOptions}
                    className="full-width"
                  >
                    {renderOptions(listContactSimple)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 6 }}>
                <Form.Item label={L("COMPANY")} name="companyId">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    disabled
                    filterOption={false}
                    className="full-width"
                  >
                    {renderOptions(companies)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 6 }}>
                <Form.Item label={L("COMPANY_LEGAL_NAME")} name="companyId">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    disabled
                    filterOption={false}
                    className="full-width"
                  >
                    {renderOptions(companyLegals)}
                  </Select>
                </Form.Item>
              </Col>
              <Col
                sm={{ span: 6 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row-reverse",
                }}
              >
                <Button
                  className="button-primary"
                  onClick={() => this.toggleCompanyModal()}
                >
                  {L("CHANGE_INFO_COMPANY")}
                </Button>
              </Col>
              <Col style={{ display: "none" }} sm={{ span: 8 }}>
                <FormInput label="OCCUPIER" name={"occupier"} />
              </Col>
              <Col sm={{ span: 8 }}>
                <Form.Item label="OCCUPIER" name={"leaseAgreementUserTenant"}>
                  <OccupierSelect onChange={this.changeOccupier} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 8, offset: 0 }}>
                <FormDatePicker
                  label={L("COMMENCEMENT_DATE")}
                  name={"commencementDate"}
                  rule={[{ required: true }]}
                  onChange={(value) => {
                    this.formRef.current?.setFieldValue("moveInDate", value)
                    this.setValueForLeaseTerm()
                  }}
                />
              </Col>
              <Col sm={{ span: 8, offset: 0 }}>
                <FormDatePicker
                  label="EXPIRY_DATE"
                  name={"expiryDate"}
                  rule={[{ required: true }]}
                  disabledDate={disabledExpriDateDate}
                  onChange={() => this.setValueForLeaseTerm()}
                />
              </Col>
              <Col sm={{ span: 8, offset: 0 }}>
                <FormInput
                  label={L("LEASE_TERM")}
                  name="leaseTerm"
                  disabled
                  // rule={[{ required: true }]}
                />
              </Col>
              <Col sm={{ span: 4 }}>
                <FormDatePicker label={L("MOVE_IN_DATE")} name="moveInDate" />
              </Col>
              <Col sm={{ span: 4 }}>
                <FormDatePicker label={L("MOVE_OUT_DATE")} name="moveOutDate" />
              </Col>
              <Col sm={{ span: 8, offset: 0 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("LA_ADMIN")}
                  name="adminId"
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    onSearch={this.handleSearchAdmin}
                    filterOption={filterOptions}
                    className="full-width"
                  >
                    {renderOptions(this.state.listAdmin ?? [])}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Form.Item label={L("LA_DESCRIPTION")} name="description">
                  <TextArea />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 0]} className="w-100">
              <Divider
                orientation="left"
                orientationMargin="0"
                style={{ fontWeight: 600, margin: "10px 0 0px 0px" }}
              >
                {L("UNIT_INFO")}
              </Divider>

              <Col sm={{ span: 6, offset: 0 }}>
                <Form.Item
                  label={L("LA_RESERVED_UNIT")}
                  name="unitInfo"
                  rules={[{ required: true }]}
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    // allowClear
                    onChange={(value) => this.onChangeUnitReservation(value)}
                    filterOption={filterOptions}
                    className="full-width"
                  >
                    {renderOptions(this.state.listReservationUnit ?? [])}
                  </Select>
                </Form.Item>
              </Col>
              {/*     <Col
                sm={{ span: 4 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                {L("OR_")}
                <Button
                  // icon={<BorderOutlined />}
                  className="button-primary"
                  onClick={() => this.toggleAddUnitModal()}
                >
                  {L("ADD_UNIT")}
                </Button> 
              </Col>*/}
              <Col sm={{ span: 10, offset: 0 }} className="warning-form">
                {this.state.myPriority !== 1 && (
                  <>
                    <ExclamationCircleFilled />
                    &nbsp;
                    {L("ONLY_UNIT_OF_RESERVATION_WITH_PROROTY_1")}
                  </>
                )}
              </Col>
              <Col style={{ display: "none" }} sm={{ span: 8 }}>
                <FormInput
                  label="RESERVATION"
                  name={"reservationId"}
                  disabled
                />
              </Col>
              {this.formRef?.current?.getFieldValue("unitInfo") && (
                <Col
                  sm={{ span: 8 }}
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                  }}
                >
                  <Button
                    // icon={<BorderOutlined />}
                    className="button-primary"
                    onClick={() => this.toggleModal()}
                  >
                    {L("SHOW_UNIT_STATUS")}
                  </Button>
                </Col>
              )}
              <Col sm={{ span: 24 }}>
                <Table
                  size="middle"
                  className="custom-ant-row"
                  // rowKey={(record) => record.id}
                  columns={columns}
                  pagination={false}
                  dataSource={this.state.dataTableReservation}
                  // loading={}
                  scroll={{ x: 100, scrollToFirstRowOnChange: true }}
                />
              </Col>
            </Row>
            <Row gutter={[8, 0]} className="w-100">
              <Col sm={{ span: 24 }}>
                <strong>{L("CONTRACT_TERM_AND_PAYMENT")}</strong>
              </Col>

              <Col sm={{ span: 8, offset: 0 }}>
                <FormSelect
                  options={paymentTerm}
                  label={L("PAYMENT_TERM")}
                  onChange={(value) =>
                    this.setState({ paymentTermChoose: value })
                  }
                  name="paymentTerm"
                  rule={[{ required: true }]}
                />
              </Col>
              <Col sm={{ span: 8 }}>
                <FormDatePicker
                  label={L("PAYMENT_DATE")}
                  name="paymentDate"
                  rule={[{ required: true }]}
                  onChange={(value) => this.setState({ paymetnDate: value })}
                  disabledDate={disabledExpriDateDate}
                />
              </Col>
              <Col sm={{ span: 6 }}>
                <Form.Item
                  label={L("EXCHANGE_RATE")}
                  name="rateUSD"
                  initialValue={0}
                >
                  <InputNumber
                    min={0}
                    className="w-100"
                    formatter={(value) => inputNumberFormatter(value)}
                    onChange={(value) => this.setState({ rateUSD: value ?? 0 })}
                  />
                </Form.Item>
              </Col>
            </Row>

            <>
              <FeeRentTable
                checkFullRent={this.checkFullRent}
                leaseTerm={this.state.leaseTerm}
                form={this.formRef}
                totalOtherFee={this.state.totalOtherFees}
                rate={this.state.rateUSD}
                dataTable={this.state.paymentForYearData}
                onDatatableChange={this.dataPaymentChange}
              />
              <OtherFeeWithAdd
                leaseTerm={this.state.leaseTerm}
                otherFeeDate={this.state.otherFeeDate}
                feeRentOption={this.state.feeRentOption}
                onDatatableChange={this.dataOtherFeeChange}
                dataTable={this.state.dataOtherFee}
              />

              <DiscountFeeTable
                leaseTerm={this.state.leaseTerm}
                form={this.formRef}
                paymentTermChoose={this.state.paymentTermChoose}
                onDatatableChange={this.dataDiscountChange}
                dataTableRent={this.state.paymentForYearData}
              />
              <Row gutter={[8, 0]} className="w-100">
                <Col sm={{ span: 16, offset: 0 }}></Col>
                <Col sm={{ span: 8, offset: 0 }}>
                  <Divider
                    orientation="left"
                    orientationMargin="0"
                    style={{ fontWeight: 600 }}
                  >
                    {L("SUMMARIZE")}
                  </Divider>
                  <Col className="form-item-highlight" sm={{ span: 24 }}>
                    <Form.Item
                      label={L("CONTRACT_AMOUNT_INCL_VAT")}
                      name="contractAmountIncludeVat"
                    >
                      <InputNumber
                        min={0}
                        className="w-100"
                        formatter={(value) => inputCurrencyFormatter(value)}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 24 }} className="form-item-highlight">
                    <Form.Item
                      label={L("CONTRACT_AMOUNT_EXCL_VAT")}
                      name="contractAmount"
                    >
                      <InputNumber
                        min={0}
                        className="w-100"
                        formatter={(value) => inputCurrencyFormatter(value)}
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  {this.state.discountData.length > 0 && (
                    <>
                      <Col sm={{ span: 24 }} className="form-item-highlight-2">
                        <Form.Item
                          label={L("CONTRACT_AMOUNT_BEFORE_DISCOUNT")}
                          name="contractAmountAfterDiscount"
                        >
                          <InputNumber
                            min={0}
                            className="w-100"
                            formatter={(value) => inputCurrencyFormatter(value)}
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      <Col sm={{ span: 24 }} className="form-item-highlight-2">
                        <Form.Item
                          label={L("LA_AMOUNT_AFTER_DISCOUNT_EXCL_VAT")}
                          name="contractAmountAfterDiscountExcludeVat"
                        >
                          <InputNumber
                            min={0}
                            className="w-100"
                            formatter={(value) => inputCurrencyFormatter(value)}
                            disabled
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Col>
              </Row>
            </>
          </Card>
          <AddUnitModal
            visible={this.state.addUnitModalVisible}
            onClose={this.toggleAddUnitModal}
            onOk={this.isChooseUnit}
          />
          <EditCompanyModal
            visible={this.state.editCompanyVisible}
            companyId={this.props.inquiryStore.inquiryDetail?.companyId}
            onClose={this.toggleCompanyModal}
            onOk={this.onOKEditCompany}
          />
          <UnitStatusModal
            visible={this.state.unitModalVisible}
            unitInfo={this.state.unitId}
            onClose={this.toggleModal}
            onOk={this.toggleModal}
          />
        </Form>
        <style>
          {`
              .ant-modal-body{
                padding: 0px;
              }
            `}
        </style>
      </Modal>
    )
  }
}

export default withRouter(CreateContractModal)
