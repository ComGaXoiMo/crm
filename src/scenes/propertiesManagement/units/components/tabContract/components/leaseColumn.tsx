import { L } from "@lib/abpUtility"
import { formatCurrency, renderDate } from "@lib/helper"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import { renderDateTime } from "@lib/helper";
import AppConsts from "@lib/appconst"
import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import SystemCreateTimeColumn from "@components/DataTable/systemCreateTimeColumn"
import { Tag } from "antd"

const { align } = AppConsts
const columns = (actionColumn?) => {
  const data = [
    actionColumn,

    {
      title: L("LA_STATUS"),
      dataIndex: "status",
      key: "status",
      ellipsis: false,
      align: align.left,
      width: 220,
      render: (status, row) => <Tag color={status?.color}>{status?.name}</Tag>,
    },
    {
      title: L("LA_CONTACT"),
      dataIndex: "contact",
      ellipsis: false,
      key: "contact",
      width: 150,
      render: (contact, row) => contact?.contactName,
    },

    {
      title: L("COMPANY"),
      dataIndex: "company",
      key: "company",
      width: 120,
      ellipsis: false,
      render: (company) => <>{company?.businessName}</>,
    },

    {
      title: L("PROJECT"),
      dataIndex: "project",
      key: "project",
      width: 120,
      ellipsis: true,
      render: (project, row) => (
        <>
          {row?.leaseAgreementUnit.map((item, index) => (
            <div key={index}>{item.project?.projectCode}</div>
          ))}
        </>
      ),
    },
    {
      title: L("UNIT_NO"),
      dataIndex: "leaseAgreementUnit",
      key: "leaseAgreementUnit",
      width: 130,
      ellipsis: false,
      render: (leaseAgreementUnit) => (
        <>
          {leaseAgreementUnit.map((item, index) => (
            <Tag key={index} color="purple">
              {item.unit?.unitName}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: L("COMMENCEMENT_DATE"),
      dataIndex: "commencementDate",
      // ellipsis: false,
      key: "commencementDate",
      align: align.center,
      width: 150,
      render: renderDate,
    },
    {
      title: L("EXPIRY_DATE"),
      dataIndex: "expiryDate",
      ellipsis: false,
      align: align.center,
      key: "expiryDate",
      width: 120,
      render: renderDate,
    },
    {
      title: L("EXTENSION_DATE"),
      dataIndex: "extensionDate",
      key: "extensionDate",
      align: align.center,
      ellipsis: false,
      width: 120,
      render: renderDate,
    },
    {
      title: L("TERMINATION_DATE"),
      dataIndex: "terminationDate",
      key: "terminationDate",
      align: align.center,
      ellipsis: false,
      width: 120,
      render: renderDate,
    },
    {
      title: L("MOVE_IN_DATE"),
      dataIndex: "moveInDate",
      key: "moveInDate",
      align: align.center,
      ellipsis: false,
      width: 120,
      render: renderDate,
    },
    {
      title: L("MOVE_OUT_DATE"),
      dataIndex: "moveOutDate",
      key: "moveOutDate",
      ellipsis: false,
      align: align.center,
      width: 120,
      render: renderDate,
    },
    {
      title: L("RENT_INC_VAT_SC"),
      dataIndex: "rentSCIncVAT",
      key: "rentSCIncVAT",
      align: align.right,
      // ellipsis: false,

      width: "130px",
      render: (rentSCIncVAT) => <>{formatCurrency(rentSCIncVAT)}</>,
    },
    {
      title: L("ALLOWANCE"),
      dataIndex: "allowance",
      align: align.right,
      ellipsis: false,
      key: "allowance",
      width: "150px",
      render: (allowance) => <>{formatCurrency(allowance)}</>,
    },

    {
      title: L("SAP_ALLOWANCE"),
      dataIndex: "sapAllowance",
      key: "sapAllowance",
      align: align.right,
      ellipsis: false,
      width: "150px",
      render: (sapAllowance) => <>{formatCurrency(sapAllowance)}</>,
    },
    {
      title: L("RENT_ONLY"),
      dataIndex: "rentOnly",
      align: align.right,
      key: "rentOnly",
      ellipsis: false,
      width: "120px",
      render: (rentOnly) => <>{formatCurrency(rentOnly)}</>,
    },
    {
      title: L("RENT_INCL_SC_EXCL_VAT"),
      dataIndex: "rentSCExcVal",
      key: "rentSCExcVal",
      align: align.right,
      ellipsis: false,
      width: "170px",
      render: (rentSCExcVal) => <>{formatCurrency(rentSCExcVal)}</>,
    },
    {
      title: L("VAT_AMOUNT"),
      dataIndex: "vatAmount",
      ellipsis: false,
      align: align.right,
      key: "vatAmount",
      width: "150px",
      render: (vatAmount) => <>{formatCurrency(vatAmount)}</>,
    },
    {
      title: L("DEPOSIT_AMOUNT"),
      dataIndex: "depositAmount",
      ellipsis: false,
      align: align.right,
      key: "depositAmount",
      width: "150px",
      render: (depositAmount) => <>{formatCurrency(depositAmount)}</>,
    },

    // {
    //   title: L("PAYMENT_STATUS"),
    //   dataIndex: "paymentStatus",
    //   key: "paymentStatus",
    //   width: "150px",
    //   render: (paymentStatus) => <>{paymentStatus}</>,
    // },
    {
      title: L("EXPIRED_DAY_NOTIFICATION"),
      dataIndex: "expiredDayNotification",
      ellipsis: false,
      key: "expiredDayNotification",
      align: align.center,
      width: "150px",
      render: (expiredDayNotification) => <>{expiredDayNotification}</>,
    },

    {
      title: L("DEALER_IN_CHARGE"),
      dataIndex: "dealer",
      ellipsis: false,
      key: "dealer",
      align: align.center,
      width: "150px",
      render: (dealer, row) => (
        <>
          {
            row?.leaseAgreementUserIncharge?.find(
              (item) => item.positionId === 0
            )?.user?.displayName
          }
        </>
      ),
    },
    {
      title: L("ADMIN_IN_CHARGE"),
      dataIndex: "adminInCharge",
      ellipsis: false,
      key: "adminInCharge",
      align: align.center,
      width: "150px",
      render: (adminInCharge, row) => (
        <>
          {
            row?.leaseAgreementUserIncharge?.find(
              (item) => item.positionId === 1
            )?.user?.displayName
          }
        </>
      ),
    },
    SystemCreateTimeColumn,
    SystemHistoryColumn,
  ]

  return data
}

export default columns
