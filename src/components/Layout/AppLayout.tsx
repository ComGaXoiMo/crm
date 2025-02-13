import "./AppLayout.less"

import * as React from "react"
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async" // Use Helmet instead of DocumentTitle
import Header from "./Header"
import { Layout } from "antd"
import ProtectedRoute from "./Router/ProtectedRoute"
import { accountMenuGroups, portalLayouts } from "./Router/router.config"
import utils from "../../utils/utils"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { sidebarStatus } from "@lib/appconst"
import NoSider from "./SiderMenu/noSider"
import FooterAppbar from "./Footer/FooterAppbar"

const { Content } = Layout

const AppLayout = inject(Stores.SessionStore)(
  observer((props: any) => {
    const [collapsed, setCollapsed] = React.useState(false)
    const [sideBarState, setSideBarState] = React.useState(sidebarStatus.menu)

    const location = useLocation()
    const navigate = useNavigate()
    const { sessionStore } = props

    React.useEffect(() => {
      if (sessionStore?.appSettingConfiguration?.isReminderCreateFeePackage) {
        navigate(portalLayouts.feePackage.path)
      }

      accountMenuGroups.forEach((key) => {
        if (key.path === location.pathname) {
          setSideBarState(sidebarStatus.account)
        }
      })

      if (location.pathname === "/app-setting") {
        setSideBarState(sidebarStatus.setting)
      }
    }, [location.pathname, sessionStore, navigate])

    // const onCollapse = () => {
    //   setCollapsed(!collapsed)
    // }

    const onChangeMenu = (value) => {
      setSideBarState(value)
      setCollapsed(false)
    }

    return (
      <>
        <Helmet>
          <title>{utils.getPageTitle(location.pathname)}</title>
        </Helmet>

        <Layout className="h-100 container-style-custom">
          <div className="footer-menu-style">
            <FooterAppbar
              sessionStore={sessionStore}
              changeMenu={onChangeMenu}
            />
          </div>

          {sideBarState === sidebarStatus.setting && <NoSider />}

          <Layout
            className="site-layout"
            style={{
              marginLeft:
                sideBarState !== 2
                  ? collapsed
                    ? 0
                    : window.innerWidth < 600
                    ? window.innerWidth
                    : 0
                  : 0,
            }}
          >
            <Header
              changeMenu={onChangeMenu}
              sessionStore={sessionStore}
              onCollapse={() =>
                setCollapsed(sideBarState !== 2 ? !collapsed : true)
              }
              sideBarState={sideBarState}
              collapsed={sideBarState !== 2 ? collapsed : true}
              history={navigate} // Replacing history with navigate function
            />

            <Content className="h-100">
              <Routes>
                {Object.keys(portalLayouts).map((route, index) => {
                  const Child = portalLayouts[route].component
                  return (
                    <Route
                      key={index}
                      path={portalLayouts[route].path}
                      element={
                        <ProtectedRoute
                          permission={portalLayouts[route].permission}
                        >
                          <Child />
                        </ProtectedRoute>
                      }
                    />
                  )
                })}
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </>
    )
  })
)

export default AppLayout
