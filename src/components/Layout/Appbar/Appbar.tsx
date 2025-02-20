import "./index.less"
import React from "react"
import LanguageSelect from "../Header/LanguageSelect"
import { Avatar } from "antd"
import { useNavigate } from "react-router-dom"
import SessionStore from "@stores/sessionStore"
import { defaultAvatar, sidebarStatus } from "@lib/appconst"
// import { portalLayouts } from "../Router/router.config";
import { SettingOutlined } from "@ant-design/icons/lib/icons"

import { portalLayouts } from "../Router/router.config"
import withRouter from "../Router/withRouter"

interface Props {
  history: any
  sessionStore: SessionStore
  changeMenu: (value: any) => void
}

const Appbar = (props: Props) => {
  const navigate = useNavigate()
  const [
    currentSidebarStatus,
    //  setCurrentSidebarStatus
  ] = React.useState<any>(undefined)
  React.useEffect(() => {
    props.sessionStore
      .getMyProfilePicture()
      .then(() => setProfilePicture(props.sessionStore.profilePicture))
  }, [])
  const [profilePicture, setProfilePicture] = React.useState(defaultAvatar)
  return (
    <div className="h-100 w-100 pr-2 d-flex flex-column justify-content-between align-items-center appbar-after">
      <div className="text-center mb-3">
        <Avatar
          style={{
            height: 40,
            width: 40,
            // , borderRadius: '50%'
          }}
          className="my-3"
          shape="square"
          alt={"profile"}
          src={"/assets/images/logoCore.png"}
        />
      </div>
      <div className="text-center my-1">
        <LanguageSelect wrapClass="wrap-item" placement={"topRight"} />
        <a
          onClick={() => {
            props.changeMenu(sidebarStatus.account)
            // currentSidebarStatus(sidebarStatus.account);
            navigate(portalLayouts.accountConfigMyProfile.path)
          }}
        >
          <span
            className={`wrap-item my-1 ${
              currentSidebarStatus === sidebarStatus.account && "styleses"
            }`}
          >
            <Avatar
              style={{ height: 40, width: 40, borderRadius: "50%" }}
              shape="circle"
              alt={"profile"}
              src={profilePicture}
            />
          </span>
        </a>
        <a
          onClick={() => {
            // props.changeMenu(sidebarStatus.setting)
            // setCurrentSidebarStatus(sidebarStatus.setting)
            // history.push(portalLayouts.appSetting.path)
          }}
        >
          <SettingOutlined
            style={{
              height: 40,
              width: 40,
              fontSize: "1.4rem",
              color: "black",
            }}
            className={`wrap-item my-3 ${
              currentSidebarStatus === sidebarStatus.setting && "styleses"
            }`}
            shape="circle"
          />
        </a>
      </div>
    </div>
  )
}

export default withRouter(Appbar)
