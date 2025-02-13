import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
import { renderDate } from "@lib/helper"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import {renderDateTime } from "@lib/helper";

const columns = (actionColumn?) => {
  const data = [
    actionColumn,

    {
      title: L("INQUIRY_STATUS"),
      dataIndex: "status",
      width: 170,
      ellipsis: true,
      key: "status",
      render: (status) => <>{status?.name}</>,
    },
    {
      title: L("INQUIRY_DETAIL_STATUS"),
      dataIndex: "statusDetail",
      width: 230,
      ellipsis: true,
      key: "statusDetail",
      render: (statusDetail) => <>{statusDetail?.name}</>,
    },
    {
      title: L("STAFF"),
      dataIndex: "creatorUser",
      width: 180,
      ellipsis: true,
      key: "creatorUser",
      render: (creatorUser) => <>{creatorUser?.displayName}</>,
    },
    {
      title: L("INQUIRY_CONTACT"),
      dataIndex: "contactId",
      width: 180,
      ellipsis: true,
      key: "contactId",
      render: (contactId, row) => <>{row?.contact?.contactName}</>,
    },
    {
      title: L("COMPANY"),
      dataIndex: "company",
      width: 200,
      ellipsis: true,
      key: "company",
      render: (company) => <>{company?.businessName}</>,
    },

    {
      title: L("EST_MOVE_IN_DATE"),
      dataIndex: "moveInDate",
      width: 120,
      ellipsis: true,
      key: "moveInDate",
      render: renderDate,
    },

    {
      title: L("DESCRIPTION"),
      dataIndex: "description",
      width: 230,
      ellipsis: true,
      key: "description",
      render: (description) => description,
    },

    SystemHistoryColumn,
  ]

  return data
}

export default columns
