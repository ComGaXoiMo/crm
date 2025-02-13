import "./index.less"
import React from "react"
import { Layout, Menu } from "antd"
import { isGranted } from "@lib/abpUtility"
import { accountMenuGroups, portalLayouts } from "../Router/router.config"
import GetMenuItems from "./MenuItem"

const { Sider } = Layout

interface Props {
  path: any;
  collapsed: boolean;
  onCollapse: any;
  history: any;
}

const AccountSider = (props: Props) => {
  let defaultSelectedKeys = ""
  Object.keys(portalLayouts).find((key) => {
    if (portalLayouts[key].path === window.location.pathname) {
      defaultSelectedKeys = portalLayouts[key].name
    }
    return ""
  })
  const menuItems = accountMenuGroups
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
      className={"sidebar"}
      width={
        props.collapsed ? 0 : window.innerWidth < 600 ? window.innerWidth : 256
      }
      onCollapse={props.onCollapse}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: window.innerWidth < 600 ? 0 : "64px",
        padding: "0 1px",
      }}
    >
      <div style={{ height: 50 }} />

      <Menu
        mode="inline"
        inlineIndent={15}
        style={{ marginTop: "20px" }}
        id={"menu-side-bar"}
        defaultSelectedKeys={[defaultSelectedKeys]}
        items={menuItems}
      />
      {/* {accountMenuGroups.map((route: any) => {
          const hasGrantedChild = (route.children || []).findIndex((item) => isGranted(item.permission))

          if (
            (route.permission && !isGranted(route.permission)) ||
            (route.children && route.children.length && hasGrantedChild === -1)
          )
            return null

          return (
            <MenuItem
              key={route.name}
              name={route.name}
              path={route.path}
              icon={route.icon}
              isGroup={route.isGroup}
              children={route.children}
              history={props.history}
            />
          )
        })} */}
      {/* </Menu> */}
    </Sider>
  )
}

export default AccountSider
