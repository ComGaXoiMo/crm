import { L } from "@lib/abpUtility"
import * as React from "react"
import AppConst from "@lib/appconst"
const { align } = AppConst

const getColumn = (actionColumn?) => {
  const data = [
    actionColumn,

    {
      title: L("PHONE"),
      dataIndex: "contactPhone",
      key: "contactPhone",
      width: 150,
      ellipsis: false,
      render: (contactPhone) => (
        <>
          {contactPhone
            .map((item) => `(+${item?.phoneCode ?? "??"}) ${item?.phone}`)
            .join(", ")}
        </>
      ),
    },
    {
      title: L("EMAIL"),
      dataIndex: "contactEmail",
      key: "contactEmail",
      width: 150,
      ellipsis: false,
      render: (contactEmail) => (
        <>{contactEmail.map((item) => item.email).join(", ")}</>
      ),
    },

    {
      title: L("TITLE"),
      dataIndex: "title",
      key: "title",
      width: 150,
      align: align.left,
      ellipsis: false,
      render: (title) => <>{title}</>,
    },
    {
      title: L("COMPANY"),
      dataIndex: "company",
      key: "company",
      width: 150,
      align: align.left,
      ellipsis: false,
      render: (company) => <>{company?.businessName ?? ""}</>,
    },
  ]

  return data
}

export default getColumn
