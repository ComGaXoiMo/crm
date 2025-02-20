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
      width={"14rem"}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <div className="flex space-between center-items">
        <div className={"wrap-logo"}>
          <Avatar
            className="wrap-avatar"
            shape="square"
            alt={"profile"}
            style={{ height: "2.5rem" }}
            src={
              collapsed
                ? "/assets/images/logoCore.png"
                : "/assets/images/large-logo.png"
            }
          />
        </div>
      </div>
      <div
        onClick={() => onCollapse(!collapsed)}
        className="ant-pro-sider-collapsed-button"
        style={{ fontSize: "18px", padding: "0 8px" }}
      >
        {collapsed ? <RightCircleOutlined /> : <LeftCircleOutlined />}
      </div>
      <div className="left-menu-bar">
        <Menu
          mode="inline"
          onClick={() => window.innerWidth < 600 && onCollapse()}
          // inlineIndent={15}
          id={"menu-side-bar"}
          defaultSelectedKeys={[defaultSelectedKeys]}
          items={menuItems}
        />
      </div>
    </Sider>
  )
}

export default SiderMenu
