import "./index.less"
import * as React from "react"
import { Layout, Menu } from "antd"
import { isGranted } from "@lib/abpUtility"
import { appMenuGroups, portalLayouts } from "../Router/router.config"
import GetMenuItems from "./MenuItem"

const { Sider } = Layout

export interface ISiderMenuProps {
  path: any;
  collapsed: boolean;
  onCollapse: any;
  history: any;
}

export interface IMenuItemProps {
  name: string;
  path?: any;
  icon?: any;
  isGroup?: boolean;
  children?: any;
  history: any;
  permission?: string;
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
    .filter((item) => !item.children.includes(null))
  return (
    <Sider
      trigger={null}
      className={"sidebar"}
      width={collapsed ? 0 : window.innerWidth < 600 ? window.innerWidth : 256}
      onCollapse={onCollapse}
      style={{
        overflowX: "hidden",
        height: "100vh",
        position: "fixed",
        left: window.innerWidth < 600 ? 0 : "64px",
      }}
    >
      <div style={{ height: 50 }} />
      <Menu
        mode="inline"
        onClick={() => window.innerWidth < 600 && onCollapse()}
        // inlineIndent={15}
        style={{ marginTop: "20px" }}
        id={"menu-side-bar"}
        defaultSelectedKeys={[defaultSelectedKeys]}
        items={menuItems}
      />
    </Sider>
  )
}

export default SiderMenu
