import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"

const { align } = AppConsts
const columns = (actionColumn?, asociateList?) => {
  const data = [
    actionColumn,
    {
      title: L("CONTACTS_TYPE"),
      dataIndex: "typeId",
      key: "typeId",
      width: 110,

      ellipsis: false,
      render: (typeId) => <>{typeId === 1 ? "Individual" : "Company"}</>,
    },
    {
      title: L("COMPANY"),
      dataIndex: "company",
      key: "company",
      width: 110,
      ellipsis: true,
      render: (company) => <>{company?.businessName ?? ""}</>,
    },
    {
      title: L("TITLE"),
      dataIndex: "title",
      key: "title",
      width: 110,
      ellipsis: false,
      render: (title) => <>{title}</>,
    },
    {
      title: L("PHONE"),
      dataIndex: "contactPhone",
      key: "contactPhone",
      ellipsis: true,
      width: 110,
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
      width: 160,
      ellipsis: true,
      render: (contactEmail) => (
        <>{contactEmail.map((item) => item.email).join(", ")}</>
      ),
    },
    {
      title: L("DEALER"),
      dataIndex: "creatorUser",
      key: "creatorUser",
      width: 140,
      ellipsis: false,

      render: (creatorUser) => <>{creatorUser?.displayName}</>,
    },

    {
      title: L("DEAL_NO_INQUIRY"),
      dataIndex: "numOfInquiry",
      key: "numOfInquiry",
      align: align.right,
      ellipsis: false,
      width: 110,
      render: (numOfInquiry) => <>{numOfInquiry}</>,
    },
    {
      title: L("DEAL_NO_LA"),
      dataIndex: "numOfLA",
      key: "numOfLA",
      align: align.right,
      ellipsis: false,
      width: 110,
      render: (numOfLA) => <>{numOfLA}</>,
    },
    {
      title: L("DEAL_SOURCE"),
      dataIndex: "leadSource",
      key: "leadSource",
      align: align.left,
      ellipsis: false,
      width: 110,
      render: (leadSource) => <>{leadSource?.name}</>,
    },
    asociateList,
    SystemHistoryColumn,
  ]

  return data
}

export default columns
