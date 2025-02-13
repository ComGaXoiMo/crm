import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import DirectoryTree from "antd/lib/tree/DirectoryTree"
import { inject, observer } from "mobx-react"
import React, { FunctionComponent } from "react"

interface TreeDataProps {
  appDataStore?: AppDataStore;
  getStaffByDepartment: (item) => any;
}

const TreeDataOrganization: FunctionComponent<TreeDataProps> = inject(
  Stores.AppDataStore
)(
  observer((props) => {
    const { appDataStore } = props
    const treeData = (appDataStore?.offices || [])
      .filter((item) => item.parentId)
      .map((office) => {
        return {
          title: office.displayName,
          key: `${office.id}`,
          children: appDataStore?.departments
            .filter((i) => i.parentId === office.id || i.id === office.id)
            .map((department) => {
              return {
                id: department.id,
                title: department.displayName,
                key: `${office.id} - ${department.id}`,
                isLeaf: true,
              }
            }),
        }
      })

    const onSelect = (keys, event) => {
      if (event.selectedNodes[0].isLeaf) {
        props.getStaffByDepartment(event.selectedNodes[0])
      }
    }

    return (
      <div>
        <DirectoryTree multiple onSelect={onSelect} treeData={treeData} />
      </div>
    )
  })
)

export default TreeDataOrganization
