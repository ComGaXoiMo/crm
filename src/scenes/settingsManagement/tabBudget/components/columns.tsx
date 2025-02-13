import { L } from "@lib/abpUtility"
import * as React from "react"
import AppConsts, { budgetAppType } from "@lib/appconst"
import { buildEditableCell } from "@components/DataTable/EditableCell"
import { formatNumberFloat } from "@lib/helper"
const { align } = AppConsts
const columns = (actionColumn?, isEditing?, budgetType?) => {
  const data = [
    {
      title: L("PROJECT"),
      dataIndex: "project",
      key: "project",
      ellipsis: false,
      width: 150,
      render: (label, row) => <div>{row?.project?.projectCode ?? ""}</div>,
    },
    {
      title: L("JAN"),
      dataIndex: "jan",
      key: "jan",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "jan", L(""), isEditing, null, []),
    },
    {
      title: L("FEB"),
      dataIndex: "feb",
      key: "feb",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "feb", L(""), isEditing, null, []),
    },
    {
      title: L("MAR"),
      dataIndex: "mar",
      key: "mar",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "mar", L(""), isEditing, null, []),
    },
    {
      title: L("APR"),
      dataIndex: "apr",
      key: "apr",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "apr", L(""), isEditing, null, []),
    },
    {
      title: L("MAY"),
      dataIndex: "may",
      key: "may",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "may", L(""), isEditing, null, []),
    },
    {
      title: L("JUN"),
      dataIndex: "jun",
      key: "jun",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "jun", L(""), isEditing, null, []),
    },
    {
      title: L("JUL"),
      dataIndex: "jul",
      key: "jul",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "jul", L(""), isEditing, null, []),
    },
    {
      title: L("AUG"),
      dataIndex: "aug",
      key: "aug",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "aug", L(""), isEditing, null, []),
    },

    {
      title: L("SEP"),
      dataIndex: "sep",
      key: "sep",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "sep", L(""), isEditing, null, []),
    },
    {
      title: L("OCT"),
      dataIndex: "oct",
      key: "oct",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "oct", L(""), isEditing, null, []),
    },
    {
      title: L("NOV"),
      dataIndex: "nov",
      key: "nov",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "nov", L(""), isEditing, null, []),
    },
    {
      title: L("DEC"),
      dataIndex: "dec",
      key: "dec",
      ellipsis: false,
      align: align.right,
      width: 150,
      render: (value) => (
        <>
          {budgetType === budgetAppType.unit
            ? `${formatNumberFloat(value)}%`
            : formatNumberFloat(value)}
        </>
      ),
      onCell: (record) =>
        buildEditableCell(record, "number", "dec", L(""), isEditing, null, []),
    },

    actionColumn,
  ]

  return data
}

export default columns
