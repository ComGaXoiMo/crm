import * as React from "react"

import { Input, Tabs, Form, Checkbox, Card } from "antd"
import { GetAllPermissionsOutput } from "@services/administrator/role/dto/getAllPermissionsOutput"
import { L, LCategory } from "@lib/abpUtility"
import RoleStore from "../../../../stores/administrator/roleStore"
import rules from "./createOrUpdateRole.validation"
import { validateMessages } from "@lib/validation"
import groupBy from "lodash/groupBy"
import AppConst, { appPermissions } from "@lib/appconst"
import Col from "antd/lib/grid/col"
import Row from "antd/lib/grid/row"
import orderBy from "lodash/orderBy"
import "./roleModal.less"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import { AppComponentListBase } from "@components/AppComponentBase"

const { formVerticalLayout } = AppConst
const TabPane = Tabs.TabPane
const { TextArea } = Input

export interface ICreateOrUpdateRoleProps {
  roleStore: RoleStore;
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (grantedPermissions) => void;
  permissions: GetAllPermissionsOutput[];
  grantedPermissions: any;
  formRef: any;
}

class CreateOrUpdateRole extends AppComponentListBase<ICreateOrUpdateRoleProps> {
  state = {
    confirmDirty: false,
    groupPermissionAdmins: [] as any,
    groupPermissionUsers: [] as any,
    isEdit: false,
  };

  componentDidUpdate(prevProps: Readonly<ICreateOrUpdateRoleProps>): void {
    if (!prevProps.visible && this.props.visible) {
      const permissionAdmin = this.props.permissions.filter((permission) =>
        permission.name.startsWith("PagesAdministration.")
      )
      const permissionUser = this.props.permissions.filter((permission) =>
        permission.name.startsWith("PagesUser.")
      )

      this.setState({
        groupPermissionAdmins: this.handleGroupPermission(permissionAdmin),
        groupPermissionUsers: this.handleGroupPermission(permissionUser),
      })
      if (this.props.modalType === "CREATE") {
        this.setState({ isEdit: true })
      } else {
        this.setState({ isEdit: false })
      }
    }
  }

  handleGroupPermission(permissions) {
    const groupPermissionObject = groupBy(permissions, "parentName")
    let groupPermissions = Object.keys(groupPermissionObject).reduce(
      (groupPermissions, key) => {
        // No need to get page permission because it's include in group
        if (key === "PagesAdministration" || key === "PagesUser") {
          return groupPermissions
        }
        const selectedPermissions = groupPermissionObject[key].filter(
          (permission) =>
            this.props.grantedPermissions.findIndex(
              (grantedPermission) => grantedPermission === permission.name
            ) !== -1
        )
        groupPermissions.push({
          name: key,
          displayName: LCategory(key),
          isSelected:
            this.props.grantedPermissions.findIndex(
              (grantedPermission) => grantedPermission === key
            ) !== -1,
          childs: orderBy(groupPermissionObject[key], "order"),
          selectedPermissions: selectedPermissions.map((item) => item.name),
        })
        return groupPermissions
      },
      [] as any
    )
    groupPermissions = orderBy(groupPermissions, "displayName")
    return groupPermissions
  }

  selectOrDeselectGroup(groupIndex, isUser?) {
    if (isUser) {
      const { groupPermissionUsers } = this.state
      groupPermissionUsers[groupIndex].isSelected =
        !groupPermissionUsers[groupIndex].isSelected
      groupPermissionUsers[groupIndex].selectedPermissions =
        groupPermissionUsers[groupIndex].isSelected
          ? groupPermissionUsers[groupIndex].childs.map((item) => item.name)
          : []

      this.setState({ groupPermissionUsers })
      return
    }
    const { groupPermissionAdmins } = this.state
    groupPermissionAdmins[groupIndex].isSelected =
      !groupPermissionAdmins[groupIndex].isSelected
    groupPermissionAdmins[groupIndex].selectedPermissions =
      groupPermissionAdmins[groupIndex].isSelected
        ? groupPermissionAdmins[groupIndex].childs.map((item) => item.name)
        : []

    this.setState({ groupPermissionAdmins })
  }

  selectOrDeselectPermissionChild(groupIndex, checkedValues, isUser?) {
    if (isUser) {
      const { groupPermissionUsers } = this.state
      groupPermissionUsers[groupIndex].selectedPermissions = checkedValues
      this.setState({ groupPermissionUsers })
      return
    }
    const { groupPermissionAdmins } = this.state
    groupPermissionAdmins[groupIndex].selectedPermissions = checkedValues
    this.setState({ groupPermissionAdmins })
  }

  onSave = () => {
    const grantedPermissions = [] as any
    const { groupPermissionAdmins, groupPermissionUsers } = this.state;
    [...groupPermissionAdmins, ...groupPermissionUsers].forEach((group) => {
      if (group.isSelected) {
        grantedPermissions.push(group.name)
      }
      group.selectedPermissions.forEach((selectedPermission) => {
        if (
          grantedPermissions.findIndex(
            (permission) => permission === selectedPermission
          ) === -1
        ) {
          grantedPermissions.push(selectedPermission)
        }
      })
    })
    this.setState({ isEdit: false })

    this.props.onOk(grantedPermissions)
  };
  onEdit = async () => {
    this.setState({ isEdit: true })
  };
  render() {
    const { groupPermissionAdmins, isEdit } = this.state
    const { visible, onCancel } = this.props
    return (
      <CustomDrawer
        useBottomAction
        title={L(this.props.modalType)}
        visible={visible}
        onClose={() => {
          this.setState({ isExistsEmail: false })
          onCancel()
        }}
        onCreate={this.props.modalType === "CREATE" ? this.onSave : undefined}
        onEdit={this.props.modalType === "EDIT" ? this.onEdit : undefined}
        onSave={this.onSave}
        isEdit={this.state.isEdit}
        updatePermission={this.isGranted(appPermissions.setting.update)}
      >
        <Form
          ref={this.props.formRef}
          validateMessages={validateMessages}
          layout={"vertical"}
          size="middle"
        >
          <Tabs defaultActiveKey={"role"} size={"small"} type="card">
            <TabPane tab={L("ST_ROLE_INFO")} key={"role"}>
              <Card className="card-detail-modal">
                <Form.Item
                  label={L("ST_ROLE_UNIQUE_NAME")}
                  {...formVerticalLayout}
                  name="name"
                  rules={rules.name}
                >
                  <Input disabled={!isEdit} />
                </Form.Item>
                <Form.Item
                  label={L("ST_ROLE_DISPLAY_NAME")}
                  {...formVerticalLayout}
                  name="displayName"
                  rules={rules.displayName}
                >
                  <Input disabled={!isEdit} />
                </Form.Item>
                <Form.Item
                  label={L("ST_ROLE_DESCRIPTION")}
                  {...formVerticalLayout}
                  name="description"
                >
                  <TextArea disabled={!isEdit} />
                </Form.Item>
              </Card>
            </TabPane>
            <TabPane
              tab={L("ST_ROLE_ADMIN_PERMISSION")}
              key={"admin-permission"}
            >
              {groupPermissionAdmins.map((groupPermission, index) => (
                <div className="group-permission-item" key={index}>
                  <div className="group-label">
                    <Checkbox
                      checked={groupPermission.isSelected}
                      onChange={() => this.selectOrDeselectGroup(index)}
                      disabled={!isEdit}
                    >
                      {groupPermission.displayName}
                    </Checkbox>
                  </div>
                  <Checkbox.Group
                    disabled={!isEdit}
                    className="full-width pt-3 mt-2"
                    onChange={(checkedValues) =>
                      this.selectOrDeselectPermissionChild(index, checkedValues)
                    }
                    value={groupPermission.selectedPermissions}
                  >
                    <Row>
                      {groupPermission.childs.map((permission, childIndex) => (
                        <Col span={8} key={childIndex}>
                          <Checkbox
                            value={permission.name}
                            disabled={!isEdit}
                            className="text-truncate"
                          >
                            {permission.displayName}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </div>
              ))}
            </TabPane>
            {/*<TabPane tab={L('ST_ROLE_USER_PERMISSION')} key={'user-permission'}>*/}
            {/*  {groupPermissionUsers.map((groupPermission, index) =>*/}
            {/*    <div className="group-permission-item" key={index}>*/}
            {/*      <div className="group-label">*/}
            {/*        <Checkbox checked={groupPermission.isSelected}*/}
            {/*                  onChange={() => this.selectOrDeselectGroup(index, true)}>*/}
            {/*          {LCategory(groupPermission.name)}*/}
            {/*        </Checkbox>*/}
            {/*      </div>*/}
            {/*      <Checkbox.Group className="full-width pt-3 mt-2"*/}
            {/*                      onChange={(checkedValues) => this.selectOrDeselectPermissionChild(index, checkedValues, true)}*/}
            {/*                      value={groupPermission.selectedPermissions}>*/}
            {/*        <Row>*/}
            {/*          {groupPermission.childs.map((permission, childIndex) =>*/}
            {/*            <Col span={8} key={childIndex}>*/}
            {/*              <Checkbox value={permission.name} className="text-truncate">*/}
            {/*                {permission.displayName}*/}
            {/*              </Checkbox>*/}
            {/*            </Col>)*/}
            {/*          }*/}
            {/*        </Row>*/}
            {/*      </Checkbox.Group>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*</TabPane>*/}
          </Tabs>
        </Form>
      </CustomDrawer>
    )
  }
}

export default CreateOrUpdateRole
