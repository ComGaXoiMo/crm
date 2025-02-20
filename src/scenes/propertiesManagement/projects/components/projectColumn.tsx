import SystemHistoryColumn from "@components/DataTable/sysyemColumn"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import { renderPercent } from "@lib/helper"
import { Tag } from "antd"
import _ from "lodash"
const { align } = AppConsts
const columns = (actionColumn?) => {
  const data = [
    actionColumn,

    {
      title: L("PROJECT_CODE"),
      dataIndex: "projectCode",
      key: "projectCode",
      width: 80,
      ellipsis: false,
      render: (projectCode, row, index) => <>{projectCode ?? ""}</>,
    },

    {
      title: L("OWNER"),
      dataIndex: "landlordName",
      ellipsis: false,
      key: "landlordName",
      width: 110,
      render: (landlordName) => <>{landlordName}</>,
    },

    {
      title: L("PROPERTY_MANAGER"),
      dataIndex: "propertyManagementName",
      key: "propertyManagementName",
      width: 80,
      // ellipsis: false,
      render: (propertyManagementName) => <>{propertyManagementName}</>,
    },
    {
      title: L("PRODUCT_TYPE"),
      dataIndex: "projectTypeMap",
      key: "projectTypeMap",
      width: 120,
      render: (projectTypeMap) => (
        <>
          {_.unionWith(
            (projectTypeMap !== null ? projectTypeMap : []).map((item) => (
              <Tag key={0} color="purple">
                {item?.propertyType?.name}
              </Tag>
            )),
            _.isEqual
          )}
        </>
      ),
    },
    {
      title: L("NUMBER_OF_UNIT"),
      dataIndex: "numberOfUnits",
      key: "numberOfUnits",
      align: align.right,
      ellipsis: false,
      width: 60,
      render: (numberOfUnits) => <>{numberOfUnits ?? ""}</>,
    },
    {
      title: L("LEASED"),
      dataIndex: "leased",
      align: align.right,
      ellipsis: false,
      key: "leased",
      width: 60,
      render: (leased) => <>{leased ?? ""}</>,
    },
    {
      title: L("OCCUPIED"),
      align: align.right,
      dataIndex: "occPercent",
      ellipsis: false,
      key: "occPercent",
      width: 60,
      render: (occPercent) => <>{renderPercent(occPercent) ?? ""}</>,
    },
    SystemHistoryColumn,
  ]

  return data
}

export default columns
