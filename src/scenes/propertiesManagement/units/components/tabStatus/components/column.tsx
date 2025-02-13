import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import { renderDate } from "@lib/helper"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import { renderDateTime } from "@lib/helper";
const { align } = AppConsts

const columns = (actionColumn?) => {
  const data = [
    actionColumn,
    {
      title: L("STATUS_START_DATE"),
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      ellipsis: false,
      align: align.center,
      render: renderDate,
    },
    {
      title: L("END_DATE"),
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      ellipsis: false,
      align: align.center,
      render: renderDate,
    },

    {
      title: L("REFERENCE_NO"),
      dataIndex: "ReferenceNumber",
      key: "ReferenceNumber",
      ellipsis: false,
      width: 200,
      render: (value, row) => <>{row?.leaseAgreement?.referenceNumber}</>,
    },
    {
      title: L("COMMENCEMENT_DATE"),
      dataIndex: "commencementDate",
      key: "commencementDate",
      width: 150,
      ellipsis: false,
      align: align.center,
      render: (value, row) => (
        <>{renderDate(row?.leaseAgreement?.commencementDate)}</>
      ),
    },
    {
      title: L("EXPIRED_DATE"),
      dataIndex: "expiredDate",
      key: "expiredDate",
      width: 150,
      align: align.center,
      ellipsis: false,
      render: (value, row) => (
        <>{renderDate(row?.leaseAgreement?.expiryDate)}</>
      ),
    },
    {
      title: L("EXTENSION_DATE"),
      dataIndex: "extensionDate",
      key: "extensionDate",
      width: 150,
      align: align.center,
      ellipsis: false,
      render: (value, row) => (
        <>{renderDate(row?.leaseAgreement?.extensionDate)}</>
      ),
    },
    {
      title: L("TERMINATION_DATE"),
      dataIndex: "terminationDate",
      key: "terminationDate",
      width: 150,
      ellipsis: false,
      align: align.center,
      render: (value, row) => (
        <>{renderDate(row?.leaseAgreement?.terminationDate)}</>
      ),
    },
    {
      title: L("MOVE_IN"),
      dataIndex: "moveIn",
      key: "moveIn",
      width: 150,
      align: align.center,
      ellipsis: false,
      render: (value, row) => (
        <>{renderDate(row?.leaseAgreement?.moveInDate)}</>
      ),
    },
    {
      title: L("MOVE_OUT"),
      dataIndex: "moveOut",
      key: "moveOut",
      width: 150,
      align: align.center,
      ellipsis: false,
      render: (value, row) => (
        <>{renderDate(row?.leaseAgreement?.moveOutDate)}</>
      ),
    },
  ]

  return data
}

export default columns
