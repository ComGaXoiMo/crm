import { L } from "@lib/abpUtility"
import * as React from "react"
// import AppConsts from "@lib/appconst";
// import SystemHistoryColumn from "@components/DataTable/sysyemColumn";
// import { CheckOutlined } from "@ant-design/icons";
// const { align } = AppConsts;
const columns = (actionColumn?) => {
  const data = [
    {
      title: L("ID"),
      dataIndex: "id",
      key: "id",
      ellipsis: false,
      width: 100,
      render: (id) => <div>{id}</div>,
    },

    actionColumn,
    {
      title: L("TEMPLATE_CONTENT"),
      dataIndex: "templateContent",
      key: "templateContent",
      ellipsis: true,
      width: 800,
      render: (templateContent, row) => (
        <div>{row.notificationTemplate?.templateContent}</div>
      ),
    },
  ]
  // (abp.localization.languages || []).forEach((item) => {
  //   data.push({
  //     title: item.name,
  //     dataIndex: item.name,
  //     key: item.name,
  //     align: align.center,
  //     width: 200,
  //     render: (language) => <>{language?.hasValue ? <CheckOutlined /> : ""}</>,
  //   });
  // });
  // data.push(
  //   {
  //     title: L(""),
  //     dataIndex: "",
  //     key: "",
  //     align: align.center,
  //     width: "",
  //   },
  //   SystemHistoryColumn
  // );
  return data
}

export default columns
