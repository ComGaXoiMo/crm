import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import DirectoryTree from "antd/lib/tree/DirectoryTree"
import { inject, observer } from "mobx-react"
import React from "react"

interface TreeDataProps {
  appDataStore?: AppDataStore;
  getStaffByDepartment: (item) => any;
}

class TreeDataOrganization extends React.Component<TreeDataProps> {
  onSelect = (keys, event) => {
    if (event.selectedNodes[0].isLeaf) {
      this.props.getStaffByDepartment(event.selectedNodes[0])
    }
  };

  render() {
    const { appDataStore } = this.props
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

    return (
      <div>
        <DirectoryTree multiple onSelect={this.onSelect} treeData={treeData} />
      </div>
    )
  }
}

export default inject(Stores.AppDataStore)(observer(TreeDataOrganization))
