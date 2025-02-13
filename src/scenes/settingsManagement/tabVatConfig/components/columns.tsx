import { L } from "@lib/abpUtility"
import * as React from "react"
import AppConsts from "@lib/appconst"
import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { renderMonth } from "@lib/helper"
import { buildEditableCell } from "@components/DataTable/EditableCell"
const { align } = AppConsts
const columns = (actionColumn?, isEditing?, listFeeType?) => {
  const data = [
    {
      title: L("FEE_TYPE"),
      dataIndex: "feeTypeId",
      key: "feeTypeId",
      ellipsis: false,
      width: 250,
      render: (label, row) => <div>{row?.feeType?.name ?? ""}</div>,
      onCell: (record) =>
        buildEditableCell(
          record,
          "select",
          "feeTypeId",
          L(""),
          isEditing,
          listFeeType,
          [{ required: true, message: "Please input this field" }]
        ),
    },
    {
      title: L("VAT_PERCENT"),
      dataIndex: "vat",
      key: "vat",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (vat: string) => <div>{vat ?? ""}</div>,
      onCell: (record) =>
        buildEditableCell(record, "number", "vat", L(""), isEditing, null, [
          { required: true, message: "Please input this field" },
          {
            pattern: /^[\d]{0,3}$/,
            message: "Max value is 100",
          },
        ]),
    },
    {
      title: L("START_DATE"),
      dataIndex: "startDate",
      key: "startDate",
      align: align.center,
      width: 150,
      render: renderMonth,
      onCell: (record) =>
        buildEditableCell(record, "month", "startDate", L(""), isEditing, null),
    },
    {
      title: L("END_DATE"),
      dataIndex: "endDate",
      key: "endDate",
      align: align.center,
      width: 150,
      render: renderMonth,
      onCell: (record) =>
        buildEditableCell(record, "month", "endDate", L(""), isEditing, null),
    },
    actionColumn,
    SystemHistoryColumn,
  ]

  return data
}

export default columns
