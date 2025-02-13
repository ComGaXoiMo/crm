import "./index.less"
import React from "react"
import LanguageSelect from "../Header/LanguageSelect"
import { Avatar } from "antd"
// import NoticeIconView from "../Header/NoticeIcon/NoticeIconView";
import { useNavigate } from "react-router-dom"
import { CodepenOutlined } from "@ant-design/icons"
import SessionStore from "@stores/sessionStore"
import { defaultAvatar, sidebarStatus } from "@lib/appconst"
import { portalLayouts } from "../Router/router.config"

interface Props {
  sessionStore: SessionStore
  changeMenu: (value: any) => void
}

const FooterAppbar = (props: Props) => {
  const navigate = useNavigate()
  React.useEffect(() => {
    props.sessionStore
      .getMyProfilePicture()
      .then(() => setProfilePicture(props.sessionStore.profilePicture))
  }, [])
  const [profilePicture, setProfilePicture] = React.useState(defaultAvatar)
  return (
    <div className="d-flex justify-content-around align-items-center w-100 pt-1">
      <a
        onClick={() => {
          props.changeMenu(sidebarStatus.menu)
          navigate(portalLayouts.dashboard.path)
        }}
      >
        <CodepenOutlined
          style={{ height: 32, width: 32, fontSize: "1.2rem" }}
          className={`wrap-item `}
          shape="circle"
        />
      </a>
      {/* <NoticeIconView history={history} wrapClass="wrap-item" /> */}

      <LanguageSelect wrapClass="wrap-item" placement={"topRight"} />
      <a
        onClick={() => {
          props.changeMenu(sidebarStatus.account)
          navigate(portalLayouts.accountConfigMyProfile.path)
        }}
      >
        <span className={`wrap-item `}>
          <Avatar
            style={{ height: 32, width: 32, borderRadius: "50%" }}
            shape="circle"
            alt={"profile"}
            src={profilePicture}
          />
        </span>
      </a>
    </div>
  )
}

export default FooterAppbar
