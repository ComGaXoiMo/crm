import { L } from "@lib/abpUtility"
// import { CalendarOutlined, UserOutlined } from "@ant-design/icons/lib";
// import { renderDateTime } from "@lib/helper";

const columns = (actionColumn?) => {
  const data = [
    {
      title: L("ID"),
      dataIndex: "id",
      key: "id",
      width: "5%",
      render: (id) => <>{id}</>,
    },
    actionColumn,
    // {
    //   title: L("PROPERTY"),
    //   dataIndex: "property",
    //   key: "property",
    //   width: "15%",
    //   ellipsis: false,
    //   render: (property) => <>{property}</>,
    // },
    {
      title: L("UNIT_NAME"),
      dataIndex: "unit",
      key: "unit",
      width: 200,
      render: (unit) => <>{unit}</>,
    },
    {
      title: L("AGENT"),
      dataIndex: "agent",
      key: "agent",
      width: 200,
      render: (agent) => <>{agent}</>,
    },
    {
      title: L("OCCUPIER_NAME"),
      dataIndex: "occupierName",
      key: "occupierName",
      width: 200,
      render: (occupierName) => <>{occupierName}</>,
    },
    {
      title: L("COMPANY_NAME"),
      dataIndex: "companyName",
      key: "companyName",
      width: 200,
      render: (companyName) => <>{companyName}</>,
    },
    {
      title: L("VISIT_DATE"),
      dataIndex: "date",
      key: "date",
      width: "",
      ellipsis: false,
      render: (date) => <>{date}</>,
    },
  ]

  return data
}

export default columns
