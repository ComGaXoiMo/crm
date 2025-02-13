import "./index.less"
import React from "react"
import { Layout, Menu } from "antd"

const { Sider } = Layout

interface Props {
  id?: any
}

const NoSider = (props: Props) => {
  return (
    <Sider
      trigger={null}
      className={"sidebar"}
      collapsed={false}
      width={0}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: "64px",
        padding: "0 1px",
      }}
    >
      <div style={{ height: 50 }} />

      <Menu
        mode="inline"
        inlineIndent={15}
        style={{ marginTop: "20px" }}
        id={"menu-side-bar"}
      >
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
      </Menu>
    </Sider>
  )
}

export default NoSider
