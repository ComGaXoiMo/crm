import "./index.less"

import * as React from "react"

import { Avatar } from "antd"
import { useNavigate } from "react-router-dom"

import SessionStore from "../../../stores/sessionStore"
import { portalLayouts } from "../Router/router.config"
// import LanguageSelect from "./LanguageSelect";
import { defaultAvatar, sidebarStatus } from "@lib/appconst"
import NoticeIconView from "./NoticeIcon/NoticeIconView"
import withRouter from "../Router/withRouter"

export interface IHeaderProps {
  history?: any
  changeMenu: (value: any) => void
  sideBarState: any
  sessionStore: SessionStore
  collapsed?: any
  onCollapse: any
}
export interface IMenuItemProps {
  name: string
  path?: any
  icon?: any
  isGroup?: boolean
  children?: any
  history: any
  permission?: string
}

const Header = (props: IHeaderProps) => {
  const navigate = useNavigate()

  const [profilePicture, setProfilePicture] = React.useState(defaultAvatar)
  React.useEffect(() => {
    props.sessionStore
      .getMyProfilePicture()
      .then(() => setProfilePicture(props.sessionStore.profilePicture))
  }, [])

  return (
    <>
      <div className={"header-container"}>
        <div className={"wrap-header"}>
          <div className="action-header wrap-header">
            <div className="wrap-profile"></div>
            <NoticeIconView history={props.history} wrapClass="wrap-noti" />
            {/* <LanguageSelect wrapClass="wrap-item" placement={"bottomLeft"} /> */}
            <a
              onClick={() => {
                props.changeMenu(sidebarStatus.account)
                // currentSidebarStatus(sidebarStatus.account);
                navigate(portalLayouts.accountConfigMyProfile.path)
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

export default withRouter(Header)
