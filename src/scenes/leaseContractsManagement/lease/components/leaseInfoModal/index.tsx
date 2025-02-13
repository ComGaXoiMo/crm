import React from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Table,
  Tag,
} from "antd";
import _, { debounce } from "lodash";
import { L } from "@lib/abpUtility";
import Stores from "@stores/storeIdentifier";
import { inject, observer } from "mobx-react";
import UnitStore from "@stores/projects/unitStore";
import withRouter from "@components/Layout/Router/withRouter";
import { AppComponentListBase } from "@components/AppComponentBase";
import FormSelect from "@components/FormItem/FormSelect";
import FormInput from "@components/FormItem/FormInput";
import FormDatePicker from "@components/FormItem/FormDatePicker";
// import LeaseDealer from "../leaseDetailComponent/leaseDealer";
import { v4 as uuid } from "uuid";
import { validateMessages } from "@lib/validation";
import {
  filterOptions,
  inputCurrencyFormatter,
  inputNumberFormatter,
  renderDate,
  renderOptions,
} from "@lib/helper";
import UnitStatusModal from "./components/unitStatusModal";
import InquiryStore from "@stores/communication/inquiryStore";
import ContactStore from "@stores/clientManagement/contactStore";
import AppConsts, { appPermissions, dateDifference } from "@lib/appconst";

import moment from "moment";
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore";
import AppDataStore from "@stores/appDataStore";
import AddUnitModal from "./components/addUnitModal";
import UserStore from "@stores/administrator/userStore";
import ReservationStore from "@stores/activity/reservationStore";
import FeeRentTable from "../leaseDetailComponent/feeRentTable";
import DiscountFeeTable from "../leaseDetailComponent/discountFeeTable";
import TextArea from "antd/lib/input/TextArea";
import { ExclamationCircleFilled, WarningOutlined } from "@ant-design/icons";
import ChooseBFTemplateModal from "./components/BookingForm/chooseBFTemplateModal";
import ChooseOLTemplateModal from "./components/OfferLetter/chooseOLTemplateModal";
import TaskModal from "@scenes/activity/taskActivity/components/taskModal";
import TaskStore from "@stores/activity/taskStore";
import ChooseTerminationNoteTemplateModal from "./components/TerminationNote/chooseTerminationNoteTemplateModal";
import ChooseLATemplateModal from "./components/LAExport/chooseLATemplateModal";
import OccupierSelect from "@components/Select/OccupierSelect";
import OtherFeeWithAdd from "../leaseDetailComponent/otherFeeWithAdd";
const {
  paymentTerm,
  align,
  roles,
  leaseStage,
  unitReservationStatus,
  term,
  depositLAStatus,
  amendmentItem,
} = AppConsts;
type Props = {
  inquiryStore: InquiryStore;
  reservationStore: ReservationStore;
  appDataStore: AppDataStore;
  userStore: UserStore;
  contactStore: ContactStore;
  leaseAgreementStore: LeaseAgreementStore;
  taskStore: TaskStore;

  id: any;
  unitStore: UnitStore;
  editStatusLA: boolean;
  isRenew: boolean;
  formRef: any;
  listLaStatus: any[];
  isEdit: boolean;
  visible: boolean;
  isAmendment: boolean;
  listAmendmentItem: any[];
  checkFullRent: (value) => void;
  onDataPaymentChange: (value) => void;
  onDataDiscountChange: (value) => void;
  onDataOtherFeeChange: (value) => void;
  onUnitChoose: (value) => void;
  changePriorty: (value) => void;
};
type State = {
  companies: any[];
  unitModalVisible: boolean;
  leaseTerm: any;
  dataPaymentForYear: any[];
  dataPaymentDiscount: any[];
  listDealer: any[];
  listAdmin: any[];
  listReservationUnit: any[];
  dataOtherFee: any[];
  dataIncentive: any[];
  unitId: any[];
  addUnitModalVisible: boolean;
  otherFeeDate: any;
  listStatusLA: any[];
  feeRentOption: any[];
  paymentDate: any;
  dataTableReservation: any[];
  paymentTermChoose: any;
  totalOtherFees: any[];
  rateUSD: number;
  myPriority: number;
  dataDiscount: any[];
  taskPic: any;
  taskModalVisible: boolean;
  chooseBFVisible: boolean;
  chooseOLVisible: boolean;
  checkIqrHasEmail: boolean;
  chooseTerminationNoteVisible: boolean;
  chooseLATemplateVisible: boolean;
};
@inject(
  Stores.InquiryStore,
  Stores.TaskStore,
  Stores.UnitStore,
  Stores.UserStore,
  Stores.ContactStore,
  Stores.LeaseAgreementStore,
  Stores.ReservationStore,
  Stores.AppDataStore
)
@observer
class LeaseInfoModal extends AppComponentListBase<Props, State> {
  formRef: any = this.props.formRef;
  constructor(props) {
    super(props);
    this.state = {
      companies: [] as any,
      dataPaymentForYear: [] as any,
      dataPaymentDiscount: [] as any,
      dataOtherFee: [] as any,
      dataIncentive: [] as any,
      feeRentOption: [] as any,
      unitModalVisible: false,
      leaseTerm: {} as any,
      listDealer: [] as any,
      listAdmin: [] as any,
      addUnitModalVisible: false,
      unitId: [] as any,
      listReservationUnit: [] as any,
      otherFeeDate: {} as any,
      paymentDate: moment(),
      paymentTermChoose: undefined,
      dataDiscount: [] as any,
      listStatusLA: [] as any,
      dataTableReservation: [] as any,
      totalOtherFees: [] as any,
      rateUSD: 0,
      myPriority: 1,
      chooseBFVisible: false,
      chooseTerminationNoteVisible: false,
      chooseLATemplateVisible: false,
      checkIqrHasEmail: true,
      chooseOLVisible: false,
      taskModalVisible: false,
      taskPic: undefined,
    };
  }
  async componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ) {
    const {
      leaseAgreementStore: { leaseAgreementDetail },
    } = this.props;

    if (prevState.dataPaymentForYear !== this.state.dataPaymentForYear) {
      const feeRentOption = this.state.dataPaymentForYear.map((item) => {
        return {
          id: item?.uniqueId,
          label: item?.name,
          startDate: moment(item?.startDate).toJSON(),
          endDate: moment(item?.endDate).toJSON(),
        };
      });

      this.setState({ feeRentOption });
    }
    if (prevState.myPriority !== this.state.myPriority) {
      this.props.changePriorty(this.state.myPriority);
    }
    if (prevProps.listLaStatus !== this.props.listLaStatus) {
      if (!this.props.editStatusLA) {
        await this.setState({
          listStatusLA: this.props.listLaStatus,
        });
      } else {
        await this.setState({
          listStatusLA: [
            ...this.props.listLaStatus,
            {
              id: leaseAgreementDetail?.status?.id,
              name: leaseAgreementDetail?.status?.name,
            },
          ],
        });
      }
    }
  }
  componentDidMount = async () => {
    const {
      leaseAgreementStore: { leaseAgreementDetail },
    } = this.props;
    this.setState({
      paymentDate: moment(leaseAgreementDetail?.paymentDate).toJSON(),
    });
    await this.getContact("");

    if (!this.props.editStatusLA) {
      await this.setState({
        listStatusLA: this.props.listLaStatus,
      });
    } else {
      await this.setState({
        listStatusLA: [
          ...this.props.listLaStatus,
          {
            id: leaseAgreementDetail?.status?.id,
            name: leaseAgreementDetail?.status?.name,
          },
        ],
      });
    }
    if (leaseAgreementDetail?.inquiryId) {
      await this.props.inquiryStore.getSimpleInquiry({
        id: leaseAgreementDetail?.inquiryId,
      });
    } else {
      this.getListInquiry("");
    }

    await this.addToListReservationUnit(leaseAgreementDetail?.inquiryId);
    if (leaseAgreementDetail?.leaseAgreementUnit[0]?.unitId) {
      if (leaseAgreementDetail?.stageId !== leaseStage.confirm) {
        await this.renderDataReservation(
          leaseAgreementDetail?.leaseAgreementUnit[0]?.unitId
        );
      }
    }

    await this.props.contactStore.addToListSimpleContact({
      id: leaseAgreementDetail?.contact?.id,
      name: leaseAgreementDetail?.contact?.contactName,
      company: [
        {
          id: leaseAgreementDetail?.companyId,
          name: leaseAgreementDetail?.company?.businessName,
        },
      ],
    });
    await this.getCompany(leaseAgreementDetail?.contactId);
    await this.setState({
      otherFeeDate: {
        startDate: leaseAgreementDetail?.commencementDate,
        endDate: leaseAgreementDetail?.expiryDate,
      },
      leaseTerm: {
        years: leaseAgreementDetail?.leaseTermYear,
        months: leaseAgreementDetail?.leaseTermMonth,
        days: leaseAgreementDetail?.leaseTermDay,
        startDate: leaseAgreementDetail?.commencementDate,
        endDate: leaseAgreementDetail?.expiryDate,
      },
    });
    await this.setState({
      unitId: leaseAgreementDetail?.leaseAgreementUnit,
    });
    this.getDealer("");
    this.getAdmin("");
    this.paymentTermChange(leaseAgreementDetail?.paymentTerm);
    if (this.props?.id) {
      await this.setState({
        dataPaymentForYear: leaseAgreementDetail?.leaseAgreementDetails
          .filter((item) => item?.feeType?.typeId === 0)
          .map((item) => {
            const diffDate = dateDifference(
              moment(item?.startDate).endOf("days"),
              moment(item?.endDate).endOf("days").add(1, "days")
            );
            return {
              ...item,
              month: diffDate?.years * 12 + diffDate.months,
              day: diffDate.days,
              key: uuid(),
            };
          }),
        dataPaymentDiscount: leaseAgreementDetail?.leaseAgreementDiscount?.map(
          (item) => {
            const diffDate = dateDifference(
              moment(item?.startDate).endOf("days"),
              moment(item?.endDate).endOf("days").add(1, "days")
            );
            return {
              ...item,
              month: diffDate?.years * 12 + diffDate.months,
              day: diffDate.days,
              key: uuid(),
            };
          }
        ),
        dataOtherFee: leaseAgreementDetail?.leaseAgreementDetails.filter(
          (item) => item?.feeType?.typeId === 2
        ),
        dataIncentive: leaseAgreementDetail?.leaseAgreementIncentive.map(
          (item) => {
            return { ...item, key: item.id };
          }
        ),
      });
    }
  };

  getListInquiry = async (keyword) => {
    this.props.inquiryStore.getSimpleInquiry({
      keyword: keyword,
      isActive: true,
      isExcludeInquiryLA: true,
      maxResultCount: 10,
      skipCount: 0,
    });
  };
  getDealer = async (keyword) => {
    await this.props.userStore.getAll({
      maxResultCount: 10,
      skipCount: 0,
      roleId: roles.dealer,
      keyword: keyword,
    });
    const lsitUser = [] as any;
    this.props.userStore.users.items.map((i) => {
      lsitUser.push({ id: i.id, name: i.displayName });
    });
    const exist =
      this.props.leaseAgreementStore.leaseAgreementDetail?.leaseAgreementUserIncharge?.find(
        (item) => item.positionId === 0
      );
    if (exist) {
      const hasIndex = lsitUser.findIndex((item) => item.id === exist.user?.id);
      if (hasIndex < 0) {
        lsitUser.push({
          id: exist.user?.id,
          name: exist.user?.displayName,
        });
      }
    }

    await this.setState({ listDealer: lsitUser });
  };
  getAdmin = async (keyword) => {
    await this.props.userStore.getAll({
      maxResultCount: 60,
      skipCount: 0,
      roleId: roles.admin,
      keyword: keyword,
    });
    const lsitUser = [] as any;
    const exist =
      this.props.leaseAgreementStore.leaseAgreementDetail?.leaseAgreementUserIncharge?.find(
        (item) => item.positionId === 0
      );
    if (exist) {
      lsitUser.push({
        id: exist.user?.id,
        name: exist.user?.displayName,
      });
    }
    this.props.userStore.users.items.map((i) => {
      lsitUser.push({ id: i.id, name: i.name });
    });
    this.setState({ listAdmin: lsitUser });
  };

  handleSearchAdmin = debounce((keyword) => {
    this.getAdmin(keyword);
  }, 400);
  getContact = async (keyword?) => {
    this.props.contactStore.getSimpleContact({
      keyword: keyword,
      isActive: true,
      maxResultCount: 10,
      skipCount: 0,
    });
  };
  getCompany = async (id?) => {
    if (id && this.props.leaseAgreementStore.leaseAgreementDetail?.companyId) {
      this.setState({
        companies: [
          {
            id: this.props.leaseAgreementStore.leaseAgreementDetail?.companyId,
            name: this.props.leaseAgreementStore.leaseAgreementDetail?.company
              ?.businessName,
          },
        ],
      });
    }
  };

  changeOccupier = async (value) => {
    const occPrimary = (value ?? []).find(
      (item: any) => item?.isPrimary === true
    );
    if (occPrimary) {
      this.formRef.current?.setFieldValue(
        "occupier",
        occPrimary?.userTenant?.name
      );
    }
  };

  addToListReservationUnit = async (inquiryId) => {
    const listReservationUnit = [] as any;
    const reservationList = await this.props.reservationStore.getAll({
      maxResultCount: 30,
      skipCount: 0,
      inquiryId: inquiryId,
      statusIds: [unitReservationStatus.new, unitReservationStatus.close],
      unitOrder: true,
    });
    await reservationList?.items?.map((item) => {
      item.reservationUnit?.map((resUnit) => {
        listReservationUnit.push({
          id: resUnit.unitId,
          name: `${resUnit?.unit.projectCode} - ${resUnit?.unit.unitName}`,
        });
      });
    });
    await this.setState({ listReservationUnit: listReservationUnit });
    if (inquiryId) {
      await this.setState({
        dataTableReservation: this.props.reservationStore.tableData?.items,
      });
    }
  };
  handleChooseInquiry = async (value) => {
    const inquiry = this.props.inquiryStore.listInquirySimple.find(
      (item) => item.id === value
    );

    this.setState({
      checkIqrHasEmail: inquiry?.contact?.contactEmail?.length > 0,
    });

    await this.addToListReservationUnit(value);
    await this.props.contactStore.addToListSimpleContact({
      id: inquiry?.contactId,
      name: inquiry?.contactName,
      company: [
        { id: inquiry?.companyId, name: inquiry?.company?.businessName },
      ],
    });
    await this.setState({
      companies: [
        { id: inquiry?.companyId, name: inquiry?.company?.businessName },
      ],
    });
    this.formRef.current?.setFieldValue("contactId", inquiry?.contactId);
    this.formRef.current?.setFieldValue("occupierName", inquiry?.occupierName);
    this.formRef.current?.setFieldValue("companyId", inquiry?.companyId);
    this.formRef.current?.setFieldValue("moveInDate", inquiry?.moveInDate);
    this.formRef.current?.setFieldValue("userId", inquiry?.creatorUser?.id);
  };

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
    );
    if (!this.formRef.current?.getFieldValue("inquiryId")) {
      await this.props.reservationStore.removeDataTable();
    }
    await this.setState({
      dataTableReservation: [
        ...this.props.reservationStore.tableData?.items,
        ...this.props.reservationStore.moreReservations,
      ],
    });
    const reservationId = this.props.reservationStore.tableData?.items.find(
      (item) => item.reservationUnit?.find((unit) => unit.unitId === unitId)
    )?.id;
    this.formRef.current?.setFieldValue("reservationId", reservationId);
  };

  dataPaymentChange = async (data) => {
    this.setState({ dataPaymentForYear: data });

    this.props.onDataPaymentChange(data);
  };
  dataDiscountChange = async (data) => {
    this.setState({ dataDiscount: data });

    this.props.onDataDiscountChange(data);
  };
  dataOtherFeeChange = async (data) => {
    this.props.onDataOtherFeeChange(data);
    await this.setState({
      totalOtherFees: data,
    });
  };

  toggleModal = () =>
    this.setState((prevState) => ({
      unitModalVisible: !prevState.unitModalVisible,
    }));
  toggleAddUnitModal = () =>
    this.setState((prevState) => ({
      addUnitModalVisible: !prevState.addUnitModalVisible,
    }));
  isChooseUnit = async (value) => {
    await this.props.unitStore.get(value[0]);
    await this.formRef.current?.setFieldValue(
      "unitInfo",
      `${this.props.unitStore.editUnit?.projectCode} - ${this.props.unitStore.editUnit?.unitName}`
    );

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
    });
    this.renderDataReservation(value[0]);
    this.props.onUnitChoose(this.state.unitId);
    await this.toggleAddUnitModal();
  };
  onChangeUnitReservation = async (value) => {
    await this.props.unitStore.get(value);
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
    });
    this.props.onUnitChoose(this.state.unitId);
    await this.renderDataReservation(value);

    const myRes = this.state.dataTableReservation.find(
      (item) =>
        item.inquiryId === this.formRef.current?.getFieldValue("inquiryId") &&
        item.reservationUnit.find((unit) => unit.unitId === value)
    );
    this.setState({
      myPriority: myRes?.reservationUnit.find((unit) => unit.unitId === value)
        ?.number,
    });
  };

  handleOk = async (params) => {
    this.props.onUnitChoose(params);
    this.formRef.current?.setFieldValue(
      "unitInfo",
      `${this.props.unitStore.editUnit?.projectCode} - ${this.props.unitStore.editUnit?.unitName}`
    );
    await this.toggleModal();
    // await this.getAll();
  };
  paymentTermChange = (value) => {
    const startDate = this.formRef.current?.getFieldValue("commencementDate");
    this.setState({ paymentTermChoose: value });
    if (value === term.oneTimePayment) {
      this.formRef.current?.setFieldValue("paymentDate", startDate);
    }
  };
  setValueForLeaseTerm = async () => {
    const startDate = this.formRef.current?.getFieldValue("commencementDate");
    const endDate = this.formRef.current?.getFieldValue("expiryDate");

    if (startDate && endDate) {
      const res = await dateDifference(
        moment(startDate).endOf("days"),
        moment(endDate).endOf("days").add(1, "days")
      );

      const leaseTerm = `${res?.years} year(s), ${res?.months} month(s), ${res?.days} day(s)`;
      await this.setState({
        leaseTerm: {
          ...res,
          startDate: moment(startDate).toJSON(),
          endDate: moment(endDate).toJSON(),
        },
      });
      await this.setState({
        otherFeeDate: {
          startDate: startDate,
          endDate: endDate,
        },
      });
      await this.formRef.current?.setFieldValue("leaseTerm", leaseTerm);
    }
  };

  disabledExpriDateDate = (current) => {
    return (
      current &&
      current < moment(this.formRef.current?.getFieldValue("commencementDate"))
    );
  };
  disablePaymentDate = (current) => {
    return (
      current &&
      (current >
        moment(this.formRef.current?.getFieldValue("expiryDate")).endOf(
          "day"
        ) ||
        current <
          moment(
            this.formRef.current?.getFieldValue("commencementDate")
          ).startOf("day"))
    );
  };

  exportBookingForm = () => {
    this.setState({ chooseBFVisible: true });
  };

  exportTerminationNote = () => {
    this.setState({ chooseTerminationNoteVisible: true });
  };
  exportLATemplate = () => {
    this.setState({ chooseLATemplateVisible: true });
  };
  exportOfferLetter = () => {
    this.setState({ chooseOLVisible: true });
  };
  handleChooseDeposit = async (value) => {
    if (value === depositLAStatus.draf) {
      this.createTask();
    }
  };
  createTask = async () => {
    if (this.props.id) {
      this.props.taskStore.createTask();
      const dealer = this.formRef.current?.getFieldValue("userId");
      const pic = this.state.listDealer.find((item) => item.id === dealer);
      this.setState({ taskPic: [pic] });

      this.toggleTaskModal();
    }
  };
  toggleTaskModal = () =>
    this.setState((prevState) => ({
      taskModalVisible: !prevState.taskModalVisible,
    }));

  render() {
    const { companies } = this.state;
    const {
      leaseAgreementStore: { leaseAgreementDetail },
      inquiryStore: { listInquirySimple },
      contactStore: { listContactSimple },
      appDataStore: { depositsStatus },
    } = this.props;
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
            );
          }),
      },
      {
        title: L("RESERVATION_EXPIRY_DATE"),
        dataIndex: "expiryDate",
        key: "expiryDate",
        align: align.center,
        width: 150,
        ellipsis: false,
        render: renderDate,
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
    ];
    const isLaConfirmed = this.props.isRenew
      ? false
      : leaseAgreementDetail?.stageId === leaseStage.confirm;
    const isLaCancel = this.props.isRenew
      ? false
      : leaseAgreementDetail?.stageId === leaseStage.drop;
    const isLaTerminate = this.props.isRenew
      ? false
      : leaseAgreementDetail?.stageId === leaseStage.terminate ||
        leaseAgreementDetail?.stageId === leaseStage.earlyTerminate;
    const isFullEdit = this.isGranted(appPermissions.leaseAgreement.fullEdit);
    return (
      <>
        <Form
          ref={this.formRef}
          layout={"vertical"}
          validateMessages={validateMessages}
          size="middle"
        >
          <Card bordered={false} className="card-detail-modal">
            <Row gutter={[8, 0]} className="w-100">
              {this.props.id && !this.props.isAmendment && (
                <Col sm={{ span: 24 }} style={{ textAlign: "right" }}>
                  {(isLaConfirmed || isLaTerminate) && (
                    <Button
                      className="button-primary"
                      onClick={() => this.exportTerminationNote()}
                    >
                      {L("EXPORT_TERMINATION_NOTE")}
                    </Button>
                  )}
                  <Button
                    className="button-primary"
                    onClick={() => this.exportBookingForm()}
                  >
                    {L("EXPORT_BOOKING_FORM")}
                  </Button>{" "}
                  <Button
                    className="button-primary"
                    onClick={() => this.exportLATemplate()}
                  >
                    {L("EXPORT_LEASE_AGREEMENT")}
                  </Button>
                </Col>
              )}
              {(this.props.isRenew || leaseAgreementDetail?.parentId) && (
                <>
                  <Col sm={{ span: 24 }}>
                    <FormInput
                      label="PARENT_REFERENT_NUMBER"
                      name={"parentNumber"}
                      disabled
                    />
                  </Col>
                  <Col style={{ display: "none" }} sm={{ span: 8 }}>
                    <FormInput label="PARENT_ID" name={"parentId"} disabled />
                  </Col>
                </>
              )}
              {!this.state.checkIqrHasEmail && (
                <Col sm={{ span: 24 }} className="warning-form">
                  <WarningOutlined />
                  &nbsp; <span> THIS_INQUIRY_CONTACT_HAVENOT_EMAIL </span>
                </Col>
              )}
              <Col sm={{ span: 16 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("INQUIRY")}
                  name="inquiryId"
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    onChange={(item) => this.handleChooseInquiry(item)}
                    filterOption={filterOptions}
                    className="full-width"
                    onSearch={debounce((e) => this.getListInquiry(e), 1000)}
                    disabled={
                      !this.props.isEdit || this.props.id || this.props.isRenew
                    }
                  >
                    {renderOptions(listInquirySimple)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 8 }}>
                <Form.Item
                  rules={[{ required: false }]}
                  label={L("PERSONS")}
                  name="persons"
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col sm={{ span: 8, offset: 0 }}>
                <FormInput
                  label="REFERENCE_NUMBER"
                  name={"referenceNumber"}
                  rule={[{ required: true }, { max: 50 }]}
                  disabled={
                    !this.props.isEdit || (!isFullEdit && isLaConfirmed)
                  }
                />
              </Col>
              <Col sm={{ span: 4 }}>
                <FormSelect
                  options={this.state.listStatusLA}
                  label={L("LA_STATUS")}
                  name="statusId"
                  rule={[{ required: true }]}
                  disabled={
                    !this.props.isEdit ||
                    isLaConfirmed ||
                    isLaCancel ||
                    isLaTerminate
                  }
                />
              </Col>
              <Col sm={{ span: 4 }}>
                <Form.Item
                  rules={[{ required: false }]}
                  label={L("DEPOSIT_STATUS")}
                  name="depositStatusId"
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    onChange={(item) => this.handleChooseDeposit(item)}
                    filterOption={filterOptions}
                    className="full-width"
                    disabled={!this.props.isEdit || isLaCancel || isLaTerminate}
                  >
                    {renderOptions(depositsStatus)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 4, offset: 0 }}>
                <FormDatePicker
                  label="SECURITY_DEPOSIT_SENT_DATE"
                  name={"depositSendDate"}
                  // dateTimeFormat={dateTimeFormat}
                  disabled={
                    !this.props.isEdit || (!isFullEdit && isLaConfirmed)
                  }
                />
              </Col>
              <Col sm={{ span: 4 }}>
                <Form.Item
                  label={L("DEPOSIT_AMOUNT")}
                  name="depositAmount"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-100"
                    formatter={(value) => inputCurrencyFormatter(value)}
                    disabled={
                      !this.props.isEdit || (!isFullEdit && isLaConfirmed)
                    }
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 8 }}>
                <Form.Item
                  label={L("CONTACT")}
                  name="contactId"
                  rules={[{ required: true }]}
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    // disabled={!this.props.isEdit}
                    filterOption={filterOptions}
                    className="full-width"
                    onSearch={debounce((e) => this.getContact(e), 1000)}
                    onChange={(value) => {
                      this.formRef.current?.resetFields(["companyId"]);
                      this.getCompany(value);
                    }}
                    disabled={
                      !this.props.isEdit ||
                      this.formRef.current?.getFieldValue("inquiryId") ||
                      (!isFullEdit && isLaConfirmed)
                    }
                  >
                    {renderOptions(listContactSimple)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 8 }}>
                <Form.Item label={L("COMPANY")} name="companyId">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    filterOption={false}
                    className="full-width"
                    // onSearch={debounce((e) => this.getCompany(e), 1000)}
                    disabled
                  >
                    {renderOptions(companies)}
                  </Select>
                </Form.Item>
              </Col>
              <Col style={{ display: "none" }} sm={{ span: 8 }}>
                <FormInput
                  label="OCCUPIER"
                  name={"occupier"}
                  disabled={
                    !this.props.isEdit || (!isFullEdit && isLaConfirmed)
                  }
                />
              </Col>
              <Col sm={{ span: 8 }}>
                <Form.Item label="OCCUPIER" name={"leaseAgreementUserTenant"}>
                  <OccupierSelect
                    onChange={this.changeOccupier}
                    valuef={leaseAgreementDetail.leaseAgreementUserTenant}
                    disabled={
                      !this.props.isEdit || (!isFullEdit && isLaConfirmed)
                    }
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 8, offset: 0 }}>
                <FormDatePicker
                  label={L("COMMENCEMENT_DATE")}
                  name={"commencementDate"}
                  rule={[{ required: true }]}
                  className={
                    this.isHasValue(
                      this.props.listAmendmentItem,
                      amendmentItem.commAndExpryDate
                    )
                      ? "la-label-amendment"
                      : ""
                  }
                  // dateTimeFormat={dateTimeFormat}
                  disabled={
                    (!this.props.isEdit &&
                      !this.isHasValue(
                        this.props.listAmendmentItem,
                        amendmentItem.commAndExpryDate
                      )) ||
                    (!isFullEdit && isLaConfirmed)
                  }
                  onChange={(value) => {
                    this.formRef.current?.resetFields(["paymentDate"]);
                    if (!this.props.id) {
                      this.formRef.current?.setFieldValue("moveInDate", value);
                    }
                    this.setValueForLeaseTerm();
                  }}
                />
              </Col>
              <Col sm={{ span: 8, offset: 0 }}>
                <FormDatePicker
                  label="EXPIRY_DATE"
                  name={"expiryDate"}
                  // dateTimeFormat={dateTimeFormat}
                  className={
                    this.isHasValue(
                      this.props.listAmendmentItem,
                      amendmentItem.commAndExpryDate
                    )
                      ? "la-label-amendment"
                      : ""
                  }
                  disabled={
                    (!this.props.isEdit &&
                      !this.isHasValue(
                        this.props.listAmendmentItem,
                        amendmentItem.commAndExpryDate
                      )) ||
                    (!isFullEdit && isLaConfirmed)
                  }
                  rule={[{ required: true }]}
                  disabledDate={this.disabledExpriDateDate}
                  onChange={() => {
                    this.setValueForLeaseTerm();
                  }}
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
              {this.props.id && (
                <>
                  <Col sm={{ span: 8, offset: 0 }}>
                    <FormDatePicker
                      label="EXTENSION_DATE"
                      disabledDate={(current) =>
                        current <=
                        moment(
                          this.formRef.current?.getFieldValue("expiryDate")
                        )
                      }
                      name={"extensionDate"}
                      disabled={!this.props.isEdit}
                    />
                  </Col>
                  <Col sm={{ span: 8 }}>
                    <FormDatePicker
                      label={L("TERMINATION_DATE")}
                      name="terminationDate"
                      disabledDate={this.disabledExpriDateDate}
                      disabled={
                        !this.props.isEdit || (!isFullEdit && isLaConfirmed)
                      }
                    />
                  </Col>
                </>
              )}
              <Col sm={{ span: 4 }}>
                <FormDatePicker
                  label={L("MOVE_IN_DATE")}
                  name="moveInDate"
                  className={
                    this.isHasValue(
                      this.props.listAmendmentItem,
                      amendmentItem.checkInAndOutDate
                    )
                      ? "la-label-amendment"
                      : ""
                  }
                  disabled={
                    (!this.props.isEdit &&
                      !this.isHasValue(
                        this.props.listAmendmentItem,
                        amendmentItem.checkInAndOutDate
                      )) ||
                    (!isFullEdit && isLaConfirmed)
                  }
                />
              </Col>
              <Col sm={{ span: 4 }}>
                <FormDatePicker
                  label={L("MOVE_OUT_DATE")}
                  name="moveOutDate"
                  className={
                    this.isHasValue(
                      this.props.listAmendmentItem,
                      amendmentItem.checkInAndOutDate
                    )
                      ? "la-label-amendment"
                      : ""
                  }
                  disabled={
                    (!this.props.isEdit &&
                      !this.isHasValue(
                        this.props.listAmendmentItem,
                        amendmentItem.checkInAndOutDate
                      )) ||
                    (!isFullEdit && isLaConfirmed)
                  }
                />
              </Col>
              {this.props.id && (
                <Col sm={{ span: 8 }}>
                  <Form.Item
                    label={L("LA_NOTIFICATION_NUM_DAY")}
                    name="expiredDayNotification"
                  >
                    <InputNumber
                      min={0}
                      className="w-100"
                      formatter={(value) => inputNumberFormatter(value)}
                      disabled={
                        !this.props.isEdit || (!isFullEdit && isLaConfirmed)
                      }
                    />
                  </Form.Item>
                </Col>
              )}
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
                    disabled={
                      !this.props.isEdit || (!isFullEdit && isLaConfirmed)
                    }
                    onSearch={this.handleSearchAdmin}
                    filterOption={filterOptions}
                    className="full-width"
                  >
                    {renderOptions(this.state.listAdmin ?? [])}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 8, offset: 0 }}>
                <Form.Item label={L("DEALER")} name="userId">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    disabled={!this.props.isEdit || !isFullEdit}
                    allowClear
                    filterOption={filterOptions}
                    className="full-width"
                  >
                    {renderOptions(this.state.listDealer ?? [])}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <Form.Item label={L("LA_DESCRIPTION")} name="description">
                  <TextArea disabled={!this.props.isEdit} />
                </Form.Item>
              </Col>
              {this.props.isAmendment && (
                <Col sm={{ span: 24, offset: 0 }}>
                  <Form.Item
                    label={L("AMENDMENT_DESCRIPTION")}
                    name="amendmentDescription"
                    className="la-label-amendment"
                  >
                    <TextArea />
                  </Form.Item>
                </Col>
              )}
              <Col style={{ display: "none" }} sm={{ span: 8 }}>
                <FormInput label="" name={"stageId"} disabled />
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
              <Col sm={{ span: 10, offset: 0 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("LA_RESERVED_UNIT")}
                  name="unitInfo"
                  className={
                    this.isHasValue(
                      this.props.listAmendmentItem,
                      amendmentItem.unit
                    )
                      ? "la-label-amendment"
                      : ""
                  }
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    // allowClear
                    onChange={(value) => this.onChangeUnitReservation(value)}
                    disabled={
                      (!this.props.isEdit &&
                        !this.isHasValue(
                          this.props.listAmendmentItem,
                          amendmentItem.unit
                        )) ||
                      (isLaConfirmed &&
                        !this.isHasValue(
                          this.props.listAmendmentItem,
                          amendmentItem.unit
                        )) ||
                      !this.formRef.current?.getFieldValue("inquiryId") ||
                      (this.props.id &&
                        !this.isHasValue(
                          this.props.listAmendmentItem,
                          amendmentItem.unit
                        ))
                    }
                    filterOption={filterOptions}
                    className="full-width"
                  >
                    {renderOptions(this.state.listReservationUnit ?? [])}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 6 }}>
                {(this.props.isAmendment ||
                  leaseAgreementDetail.amendmentMoveInDate) && (
                  <FormDatePicker
                    label={L("AMENDMENT_UNIT_MOVE_IN_DATE")}
                    name="amendmentMoveInDate"
                    className={
                      this.isHasValue(
                        this.props.listAmendmentItem,
                        amendmentItem.unit
                      )
                        ? "la-label-amendment"
                        : ""
                    }
                    disabled={
                      (!this.props.isEdit &&
                        !this.isHasValue(
                          this.props.listAmendmentItem,
                          amendmentItem.unit
                        )) ||
                      (!isFullEdit && isLaConfirmed)
                    }
                  />
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
                    className="button-primary"
                    onClick={() => this.toggleModal()}
                  >
                    {L("SHOW_UNIT_STATUS")}
                  </Button>
                </Col>
              )}
              <Col sm={{ span: 24, offset: 0 }} className="warning-form">
                {this.state.myPriority !== 1 && (
                  <>
                    <ExclamationCircleFilled />
                    &nbsp;
                    {L("ONLY_UNIT_OF_RESERVATION_WITH_PROROTY_1")}
                  </>
                )}
              </Col>
              <Col sm={{ span: 24 }}>
                <Table
                  size="middle"
                  className="custom-ant-row"
                  rowKey={(record) => record?.id}
                  columns={columns}
                  pagination={false}
                  dataSource={this.state.dataTableReservation}
                  loading={this.props.reservationStore.isLoading}
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
                  formItemClass={
                    this.isHasValue(
                      this.props.listAmendmentItem,
                      amendmentItem.paymentTerm
                    )
                      ? "la-label-amendment"
                      : ""
                  }
                  label={L("PAYMENT_TERM")}
                  name="paymentTerm"
                  onChange={(value) => this.paymentTermChange(value)}
                  rule={[{ required: true }]}
                  disabled={
                    (!this.props.isEdit &&
                      !this.isHasValue(
                        this.props.listAmendmentItem,
                        amendmentItem.paymentTerm
                      )) ||
                    (!isFullEdit && isLaConfirmed)
                  }
                />
              </Col>
              <Col sm={{ span: 8 }}>
                <FormDatePicker
                  label={L("PAYMENT_DATE")}
                  name="paymentDate"
                  rule={[{ required: true }]}
                  onChange={(value) => this.setState({ paymentDate: value })}
                  disabledDate={this.disablePaymentDate}
                  className={
                    this.isHasValue(
                      this.props.listAmendmentItem,
                      amendmentItem.paymentDate
                    )
                      ? "la-label-amendment"
                      : ""
                  }
                  disabled={
                    (!this.props.isEdit &&
                      !this.isHasValue(
                        this.props.listAmendmentItem,
                        amendmentItem.paymentDate
                      )) ||
                    (!isFullEdit && isLaConfirmed) ||
                    this.state.paymentTermChoose === term.oneTimePayment
                  }
                />
              </Col>

              <Col sm={{ span: 8 }}>
                <Form.Item
                  label={L("EXCHANGE_RATE")}
                  name="rateUSD"
                  initialValue={0}
                  className={
                    this.isHasValue(
                      this.props.listAmendmentItem,
                      amendmentItem.exchangeRate
                    )
                      ? "la-label-amendment"
                      : ""
                  }
                >
                  <InputNumber
                    min={0}
                    className="w-100"
                    formatter={(value) => inputNumberFormatter(value)}
                    onChange={(value) => this.setState({ rateUSD: value ?? 0 })}
                    disabled={
                      (!this.props.isEdit &&
                        !this.isHasValue(
                          this.props.listAmendmentItem,
                          amendmentItem.exchangeRate
                        )) ||
                      (!isFullEdit && isLaConfirmed)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            {this.props.visible && (
              <>
                <FeeRentTable
                  leaseTerm={this.state.leaseTerm}
                  form={this.formRef}
                  isAmendment={this.isHasValue(
                    this.props.listAmendmentItem,
                    amendmentItem.rent
                  )}
                  totalOtherFee={this.state.totalOtherFees}
                  rate={this.state.rateUSD}
                  disabled={
                    (!this.props.isEdit &&
                      !this.isHasValue(
                        this.props.listAmendmentItem,
                        amendmentItem.rent
                      )) ||
                    (!isFullEdit && isLaConfirmed)
                  }
                  onDatatableChange={this.dataPaymentChange}
                  checkFullRent={this.props.checkFullRent}
                  dataTable={this.state.dataPaymentForYear}
                />

                <OtherFeeWithAdd
                  leaseTerm={this.state.leaseTerm}
                  isAmendment={this.isHasValue(
                    this.props.listAmendmentItem,
                    amendmentItem.otherFee
                  )}
                  disabled={
                    (!this.props.isEdit &&
                      !this.isHasValue(
                        this.props.listAmendmentItem,
                        amendmentItem.otherFee
                      )) ||
                    (!isFullEdit && isLaConfirmed)
                  }
                  otherFeeDate={this.state.otherFeeDate}
                  feeRentOption={this.state.feeRentOption}
                  onDatatableChange={this.dataOtherFeeChange}
                  dataTable={this.state.dataOtherFee}
                />
                <DiscountFeeTable
                  leaseTerm={this.state.leaseTerm}
                  form={this.formRef}
                  isAmendment={this.isHasValue(
                    this.props.listAmendmentItem,
                    amendmentItem.discount
                  )}
                  paymentTermChoose={this.state.paymentTermChoose}
                  disabled={
                    (!this.props.isEdit &&
                      !this.isHasValue(
                        this.props.listAmendmentItem,
                        amendmentItem.discount
                      )) ||
                    (!isFullEdit && isLaConfirmed)
                  }
                  onDatatableChange={this.dataDiscountChange}
                  dataTable={this.state.dataPaymentDiscount}
                  dataTableRent={this.state.dataPaymentForYear}
                />
              </>
            )}
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

                {this.state.dataDiscount.length > 0 && (
                  <>
                    <Col sm={{ span: 24 }} className="form-item-highlight-2">
                      <Form.Item
                        label={L("CONTRACT_AMOUNT_BEFORE_DISCOUNT")}
                        name="contractAmountAfterDiscountIncludeVat"
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
          </Card>
        </Form>
        <AddUnitModal
          visible={this.state.addUnitModalVisible}
          onClose={this.toggleAddUnitModal}
          onOk={this.isChooseUnit}
        />
        <UnitStatusModal
          visible={this.state.unitModalVisible}
          unitInfo={this.state.unitId}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
        <ChooseBFTemplateModal
          leaseAgreementId={this.props.id}
          visible={this.state.chooseBFVisible}
          onClose={() => this.setState({ chooseBFVisible: false })}
        />
        <ChooseTerminationNoteTemplateModal
          leaseAgreementId={this.props.id}
          visible={this.state.chooseTerminationNoteVisible}
          onClose={() => this.setState({ chooseTerminationNoteVisible: false })}
        />

        <ChooseLATemplateModal
          leaseAgreementId={this.props.id}
          visible={this.state.chooseLATemplateVisible}
          onClose={() => this.setState({ chooseLATemplateVisible: false })}
        />
        <ChooseOLTemplateModal
          visible={this.state.chooseOLVisible}
          onClose={() => this.setState({ chooseOLVisible: false })}
        />
        <TaskModal
          inquiryId={this.props.id}
          listPic={this.state.taskPic}
          visible={this.state.taskModalVisible}
          onClose={this.toggleTaskModal}
          onOk={this.toggleTaskModal}
        />
      </>
    );
  }
}

export default withRouter(LeaseInfoModal);
