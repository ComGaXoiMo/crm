import { CloseCircleOutlined } from "@ant-design/icons"
import { Button, Input, Menu, notification, Popover, Spin } from "antd"
import { Modal } from "antd"
import Title from "antd/lib/typography/Title"
import React, { useState } from "react"
import { L } from "../../../../lib/abpUtility"
import debounce from "lodash/debounce"
import userService from "@services/administrator/user/userService"
import http from "@services/httpService"

interface StaffListProps {
  addedTime: string;
  emailAddress: string;
  id: number;
  isHead: boolean;
  name: string;
  surname: string;
  userName: string;
}
interface OrganizationUnitProps {
  loading: boolean;
  staffList: Array<StaffListProps>;
  activeOrganization: any;
  getStaffByDepartment: (item) => any;
}
interface SearchedStaffListProps {
  creationTime: string;
  emailAddress: string;
  fullName: string;
  id: number;
  isActive: boolean;
  lastLoginTime: string;
  name: string;
  roleNames: Array<string>;
  surname: string;
  userName: string;
}

function OrganizationUnitControl(props: OrganizationUnitProps) {
  const { loading, staffList, activeOrganization } = props
  const [searchedStaffList, setSearchedStaffList] = useState<
    Array<SearchedStaffListProps>
  >([])

  function warning(staff) {
    Modal.confirm({
      title: "Remove staff",
      content: `Do you want to remove ${staff.name} from ${activeOrganization.title} ?`,
      onOk: async () => {
        await http.delete(
          `/api/OrganizationUnit/RemoveUserFromOrganizationUnit`,
          {
            params: {
              UserId: staff.id,
              OrganizationUnitId: activeOrganization.id,
            },
          }
        )
        notification.success({
          message: "Removed",
        })
        await props.getStaffByDepartment(activeOrganization)
      },
    })
  }

  function confirm(staff) {
    Modal.confirm({
      title: "Add staff",
      content: `Do you want to add ${staff.name} to ${activeOrganization.title} ?`,
      onOk: async () => {
        await http.post(`/api/OrganizationUnit/AddUsersToOrganizationUnit`, {
          userId: staff.id,
          isHead: false,
          organizationUnitId: activeOrganization.id,
        })
        notification.success({
          message: "Successfully added",
        })
        await props.getStaffByDepartment(activeOrganization)
      },
    })
  }

  const findAssignedUsers = debounce(async (keywords) => {
    if (keywords === "") return
    const keyword = keywords.replace(/ /g, "")
    const result = await userService.findUsers({
      keyword,
      maxResultCount: 10,
      skipCount: 0,
    })
    setSearchedStaffList(result)
  }, 500)
  const searchInputContent = (
    <>
      <Input
        width="100%"
        onChange={(e) => findAssignedUsers(e.currentTarget.value)}
      />
      <Menu>
        {searchedStaffList.map((staff) => (
          <Menu.Item
            className="w-100 d-flex justify-content-between"
            key={staff.id}
            onClick={() => confirm(staff)}
          >
            <span>{staff.name}</span>
          </Menu.Item>
        ))}
      </Menu>
    </>
  )
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <span>
          <Title level={4}>{activeOrganization.title}</Title>
        </span>
        <span>
          <Popover
            placement="bottomRight"
            title="Find name"
            content={searchInputContent}
            trigger="click"
          >
            <Button
              type="primary"
              disabled={activeOrganization === 0 ? true : false}
            >
              + {L("BTN_ADD")}
            </Button>
          </Popover>
        </span>
      </div>
      {loading && (
        <div className="w-100 text-center">
          <Spin />
        </div>
      )}
      {!loading && (
        <Menu>
          {staffList.map((staff) => {
            return (
              <Menu.Item
                className="w-100 d-flex justify-content-between"
                key={staff.id}
              >
                <span>{staff.emailAddress}</span>
                <span>
                  <CloseCircleOutlined
                    className="text-danger"
                    onClick={() => warning(staff)}
                  />
                </span>
              </Menu.Item>
            )
          })}
        </Menu>
      )}
    </div>
  )
}

export default OrganizationUnitControl
