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
    // {
    //   title: L("PROPERTY"),
    //   dataIndex: "projectName",
    //   key: "projectName",
    //   width: "15%",
    //   ellipsis: false,
    //   render: (projectName) => <>{projectName}</>,
    // },
    // {
    //   title: L("LOCATION"),
    //   dataIndex: "projectAddress",
    //   key: "projectAddress",
    //   ellipsis: false,
    //   width: "10%",
    //   render: (projectAddress) => (
    //     <>{projectAddress.map((item) => item?.address).join(", ")}</>
    //   ),
    // },
    {
      title: L("PROJECT_CODE"),
      dataIndex: "projectCode",
      key: "projectCode",
      width: 60,
      ellipsis: false,
      render: (projectCode, row, index) => <>{projectCode ?? ""}</>,
    },
    {
      title: L("PROJECT_SORT_NUMBER"),
      dataIndex: "sortNumber",
      key: "sortNumber",
      width: 40,
      align: align.right,
      ellipsis: false,
      render: (sortNumber, row, index) => <>{sortNumber ?? ""}</>,
    },
    {
      title: L("OWNER"),
      dataIndex: "landlordName",
      ellipsis: false,
      key: "landlordName",
      width: 150,
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
      width: 80,
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
    // {
    //   title: L("NUMBER_OF_UNIT"),
    //   dataIndex: "numberOfUnits",
    //   key: "numberOfUnits",
    //   align: align.right,
    //   ellipsis: false,
    //   width: 60,
    //   render: (numberOfUnits) => <>{numberOfUnits ?? ""}</>,
    // },
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
