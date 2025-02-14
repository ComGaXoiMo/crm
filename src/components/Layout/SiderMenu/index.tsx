import "./index.less"
import * as React from "react"
import { Avatar, Layout, Menu } from "antd"
import { isGranted } from "@lib/abpUtility"
import { appMenuGroups, portalLayouts } from "../Router/router.config"
import GetMenuItems from "./MenuItem"
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons"
import SessionStore from "@stores/sessionStore"

const { Sider } = Layout

export interface ISiderMenuProps {
  path: any
  collapsed: boolean
  onCollapse: any
  sessionStore: SessionStore
}

export interface IMenuItemProps {
  name: string
  path?: any
  icon?: any
  isGroup?: boolean
  children?: any
  permission?: string
}

const SiderMenu = (props: ISiderMenuProps) => {
  const { collapsed, onCollapse } = props

  let defaultSelectedKeys = ""
  Object.keys(portalLayouts).find((key) => {
    if (portalLayouts[key].path === window.location.pathname) {
      defaultSelectedKeys = portalLayouts[key].name
    }
    return ""
  })

  const menuItems = appMenuGroups
    .filter((route: any) => {
      const hasGrantedChild = (route.children || []).findIndex((item) =>
        isGranted(item.permission)
      )
      return (
        isGranted(route.permission) ||
        (route.children && route.children.length && hasGrantedChild !== -1)
      )
    })
    .map((route: any) => {
      return GetMenuItems(route)
    })
  return (
    <Sider
      trigger={null}
      className="sidebar"
      width={240}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <div className="flex space-between center-items">
        <div className={"wrap-logo"}>
          <Avatar
            style={{ height: 35, width: 35 }}
            className="my-3"
            shape="square"
            alt={"profile"}
            src={"/assets/images/logoCore.png"}
          />
        </div>
        <div
          onClick={() => onCollapse(!collapsed)}
          style={{ fontSize: "18px", padding: "0 8px" }}
        >
          {collapsed ? <RightCircleOutlined /> : <LeftCircleOutlined />}
        </div>
      </div>
      <Menu
        mode="inline"
        onClick={() => window.innerWidth < 600 && onCollapse()}
        // inlineIndent={15}
        id={"menu-side-bar"}
        defaultSelectedKeys={[defaultSelectedKeys]}
        items={menuItems}
      />
    </Sider>
  )
}

export default SiderMenu
