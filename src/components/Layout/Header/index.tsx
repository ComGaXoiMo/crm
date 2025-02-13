import "./index.less"

import * as React from "react"

import { Avatar, Menu } from "antd"

import SessionStore from "../../../stores/sessionStore"
import { isGranted } from "@lib/abpUtility"
import { appMenuGroups, portalLayouts } from "../Router/router.config"
import GetMenuItems from "./MenuItem"
// import LanguageSelect from "./LanguageSelect";
import { defaultAvatar, sidebarStatus } from "@lib/appconst"
import NoticeIconView from "./NoticeIcon/NoticeIconView"

export interface IHeaderProps {
  history?: any;
  changeMenu: (value: any) => void;
  sideBarState: any;
  sessionStore: SessionStore;
  collapsed?: any;
  onCollapse: any;
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

const Header = (props: IHeaderProps) => {
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

  const selectedKey = menuItems.find((item) =>
    location.pathname.startsWith(item.key)
  )?.key

  const [profilePicture, setProfilePicture] = React.useState(defaultAvatar)
  // .filter((item) => !item.children.includes(null));
  React.useEffect(() => {
    props.sessionStore
      .getMyProfilePicture()
      .then(() => setProfilePicture(props.sessionStore.profilePicture))
  }, [])

  return (
    <>
      <div className={"header-container"}>
        <div className={"wrap-header"}>
          <div className="action-header">
            <Avatar
              style={{
                height: 35,
                width: 35,
                // , borderRadius: '50%'
              }}
              className="my-3"
              shape="square"
              alt={"profile"}
              src={"/assets/images/logoCore.png"}
            />
          </div>
          <Menu
            className="ant-menu-bar"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={menuItems}
          ></Menu>
          <div className="action-header  wrap-header">
            <div className="wrap-profile"></div>
            <NoticeIconView history={props.history} wrapClass="wrap-noti" />
            {/* <LanguageSelect wrapClass="wrap-item" placement={"bottomLeft"} /> */}
            <a
              onClick={() => {
                props.changeMenu(sidebarStatus.account)
                // currentSidebarStatus(sidebarStatus.account);
                props.history.push(portalLayouts.accountConfigMyProfile.path)
              }}
            >
              <span className={`my-1 `}>
                <Avatar
                  style={{
                    marginLeft: 12,
                    height: 35,
                    width: 35,
                    borderRadius: "50%",
                  }}
                  shape="circle"
                  alt={"profile"}
                  src={profilePicture}
                />
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
