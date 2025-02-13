import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
import { renderDate } from "@lib/helper"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import { renderDateTime } from "@lib/helper";

const columns = (actionColumn?) => {
  const data = [
    {
      title: L("INQUIRY_NAME"),
      dataIndex: "inquiriesName",
      key: "inquiriesName",
      width: 100,
      ellipsis: false,
      render: (inquiriesName, row, index) => (
        <> {inquiriesName ?? "Inquiry " + index}</>
      ),
    },
    // actionColumn,
    {
      title: L("UNIT_NO"),
      dataIndex: "unitNo",
      width: 120,
      ellipsis: false,
      key: "unitNo",
      render: (unitNo) => <>{unitNo ?? ""}</>,
    },
    {
      title: L("INQUIRY_CONTACT"),
      dataIndex: "contactId",
      key: "contactId",
      width: 120,
      ellipsis: false,
      render: (contactId, row) => <>{row?.contact?.contactName}</>,
    },
    {
      title: L("INQUIRY_COMPANY"),
      dataIndex: "companyId",
      key: "companyId",
      width: 120,
      ellipsis: false,
      render: (companyId, row) => <>{row?.companyId?.companyName}</>,
    },
    {
      title: L("OCCUPIER"),
      dataIndex: "occupier",
      key: "occupier",
      width: 120,
      ellipsis: false,
      render: (occupier) => <>{occupier}</>,
    },

    {
      title: L("INQUIRY_STAGE"),
      dataIndex: "statusId",
      width: 120,
      ellipsis: false,
      render: (statusId, row) => <>{row.status?.name ?? "--"}</>,
    },
    {
      title: L("INQUIRY_SUB_STAGE"),
      dataIndex: "subStageId",
      width: 120,
      ellipsis: false,
      render: (subStageId, row) => <>{row.subStage?.name ?? "--"}</>,
    },

    {
      title: L("INQUIRY_LEASE_TERM"),
      dataIndex: "leaseTerm",
      width: 120,
      ellipsis: false,
      render: (leaseTerm) => <>{leaseTerm ?? "--"}</>,
    },
    {
      title: L("BUDGET"),
      dataIndex: "budget",
      width: 160,
      ellipsis: false,
      render: (budget) => <>{budget ?? "--"}</>,
    },
    {
      title: L("SIZE"),
      dataIndex: "size",
      width: 120,
      ellipsis: false,
      render: (size) => <>{size ?? "--"}</>,
    },
    {
      title: L("EST_MOVE_IN_DATE"),
      dataIndex: "estMoveInDate",
      width: 120,
      ellipsis: false,
      render: renderDate,
    },
    // {
    //   title: L("INQUIRY_SOURCE"),
    //   dataIndex: "source",
    //   width: 80,
    //   ellipsis: false,
    //   render: (source, row) => <>{row.source?.name ?? "--"}</>,
    // },

    // {
    //   title: L("INQUIRY_PROPERTY_TYPE"),
    //   dataIndex: "propertyTypeId",
    //   width: 80,
    //   ellipsis: false,
    //   render: (propertyTypeId, row) => <>{row.propertyType?.name ?? "--"}</>,
    // },
    // {
    //   title: L("INQUIRY_UNIT_TYPE"),
    //   dataIndex: "unitTypeId",
    //   width: 60,
    //   ellipsis: false,
    //   render: (unitTypeId, row) => <>{row.unitType?.name ?? "1:1"}</>,
    // },
    {
      title: L("DESCRIPTION"),
      dataIndex: "description",
      width: 200,
      ellipsis: false,
      render: (description) => description,
    },
    SystemHistoryColumn,
  ]

  return data
}

export default columns
