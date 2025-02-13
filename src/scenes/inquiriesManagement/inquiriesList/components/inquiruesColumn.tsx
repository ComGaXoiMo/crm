import SystemCreateTimeColumn from "@components/DataTable/systemCreateTimeColumn"
import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import { renderDate } from "@lib/helper"
import { Tag } from "antd"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import {renderDateTime } from "@lib/helper";
const { align } = AppConsts

const columns = (actionColumn?) => {
  const data = [
    // {
    //   title: L("ID_INQUYRY"),
    //   dataIndex: "id",
    //   width: 60,
    //   ellipsis: false,
    //   key: "id",
    //   render: (id) => <>{id}</>,
    // },
    actionColumn,

    {
      title: L("INQUIRY_STATUS"),
      dataIndex: "status",
      width: 170,
      ellipsis: false,
      key: "status",
      render: (status) => <>{status?.name}</>,
    },
    {
      title: L("INQUIRY_DETAIL_STATUS"),
      dataIndex: "statusDetail",
      width: 230,
      ellipsis: false,
      key: "statusDetail",
      render: (statusDetail) => <>{statusDetail?.name}</>,
    },
    {
      title: L("STAFF"),
      dataIndex: "creatorUser",
      width: 180,
      ellipsis: false,
      key: "creatorUser",
      render: (creatorUser) => <>{creatorUser?.displayName}</>,
    },
    {
      title: L("INQUIRY_CONTACT"),
      dataIndex: "contactId",
      width: 180,
      ellipsis: false,
      key: "contactId",
      render: (contactId, row) => <>{row?.contact?.contactName}</>,
    },
    {
      title: L("COMPANY"),
      dataIndex: "company",
      width: 200,
      ellipsis: false,
      key: "company",
      render: (company) => <>{company?.businessName}</>,
    },

    {
      title: L("OCCUPIER"),
      dataIndex: "occupierName",
      width: 180,
      ellipsis: false,
      key: "occupierName",
      render: (occupierName) => <>{occupierName}</>,
    },
    {
      title: L("NUM_OF_RESERVATION"),
      dataIndex: "numReservation",
      width: 140,
      align: align.right,
      ellipsis: false,
      key: "numReservation",
      render: (numReservation) => <>{numReservation}</>,
    },
    {
      title: L("INQUIRY_PROPERTY_TYPE"),
      dataIndex: "inquiryPropertyTypeMap",
      width: 180,
      ellipsis: false,
      key: "inquiryPropertyTypeMap",
      render: (inquiryPropertyTypeMap, row) => (
        <>
          {inquiryPropertyTypeMap.map((item, index) => (
            <Tag className="cell-round mr-1" color="#23a887" key={index}>
              {item.propertyType?.name}
            </Tag>
          ))}
        </>
      ),
    },

    {
      title: L("INQUIRY_UNIT_TYPE"),
      dataIndex: "inquiryUnitTypeMap",
      width: 120,
      ellipsis: false,
      key: "inquiryUnitTypeMap",
      render: (inquiryUnitTypeMap, row) => (
        <>
          {inquiryUnitTypeMap.map((item, index) => (
            <Tag className="cell-round mr-1" color="#2394a8" key={index}>
              {item.unitType?.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: L("EST_MOVE_IN_DATE"),
      dataIndex: "moveInDate",
      width: 120,
      ellipsis: false,
      key: "moveInDate",
      render: renderDate,
    },

    {
      title: L("DESCRIPTION"),
      dataIndex: "description",
      width: 230,
      ellipsis: false,
      key: "description",
      render: (description) => description,
    },
    SystemCreateTimeColumn,
    SystemHistoryColumn,
  ]

  return data
}

export default columns
