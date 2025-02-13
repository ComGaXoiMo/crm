import { L } from "@lib/abpUtility"
import * as React from "react"
import AppConst from "@lib/appconst"
import { Tag } from "antd"
import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
const { align } = AppConst

const columns = (actionColumn?) => {
  const data = [
    actionColumn,
    // {
    //   title: L("FULL_NAME"),
    //   dataIndex: "displayName",
    //   key: "displayName",
    //   width: "15%",
    //   ellipsis: false,
    //   render: (text: string) => <>{text}</>,
    // },
    {
      title: L("EMAIL_ADDRESS"),
      dataIndex: "emailAddress",
      key: "emailAddress",
      width: 300,
      ellipsis: false,
      render: (text: string) => <>{text}</>,
    },

    // {
    //   title: L("USER_NAME"),
    //   dataIndex: "userName",
    //   key: "userName",
    //   ellipsis: false,
    //   width: "20%",
    //   render: (text: string) => <>{text}</>,
    // },

    {
      title: L("TEAM"),
      dataIndex: "userOrganizationUnit",
      key: "userOrganizationUnit",
      width: 300,
      align: align.left,
      render: (userOrganizationUnit) => (
        <>
          {userOrganizationUnit?.map((item, index) => (
            <Tag key={index} color={item?.isHead ? "purple " : "purple"}>
              {item?.organizationUnitName}
            </Tag>
          )) ?? []}
        </>
      ),
    },
    {
      title: L("ROLE"),
      dataIndex: "roleNames",
      key: "roleNames",
      width: 300,
      align: align.left,
      render: (roleNames) => (
        <>
          {roleNames?.map((item, index) => (
            <Tag key={index} color="blue">
              {item}
            </Tag>
          )) ?? []}
        </>
      ),
    },
    {
      title: L("PROJECT"),
      dataIndex: "projectUser",
      key: "projectUser",
      width: 300,
      align: align.left,
      render: (projectUser) => (
        <>
          {projectUser?.map((item, index) => (
            <Tag key={index} color="geekblue">
              {item.project?.projectCode}
            </Tag>
          )) ?? []}
        </>
      ),
    },

    SystemHistoryColumn,
  ]

  return data
}

export default columns
