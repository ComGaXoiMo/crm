import "./AppLayout.less"

import * as React from "react"

import { Switch } from "react-router-dom"

import DocumentTitle from "react-document-title"
import Header from "./Header"
import { Layout } from "antd"
import ProtectedRoute from "./Router/ProtectedRoute"
import { accountMenuGroups, portalLayouts } from "./Router/router.config"
import utils from "../.././utils/utils"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
// import Appbar from "./Appbar/Appbar";
import { sidebarStatus } from "@lib/appconst"
// import AccountSider from "./SiderMenu/accountSider";
import NoSider from "./SiderMenu/noSider"
import FooterAppbar from "./Footer/FooterAppbar"

const { Content } = Layout

@inject(Stores.SessionStore)
@observer
class AppLayout extends React.Component<any> {
  state = {
    collapsed: false,
    sideBarState: sidebarStatus.menu,
  }

  componentDidMount = async () => {
    if (
      this.props.sessionStore!.appSettingConfiguration
        ?.isReminderCreateFeePackage
    ) {
      const { history } = this.props
      history?.push(portalLayouts.feePackage.path)
    }
    accountMenuGroups.map((key) => {
      if (key.path === this.props.location.pathname) {
        this.setState({ sideBarState: sidebarStatus.account })
      }
    })
    if (this.props.location.pathname === "/app-setting") {
      this.setState({ sideBarState: sidebarStatus.setting })
    }
  }

  onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  onChangeMenu = (value) => {
    this.setState({ sideBarState: value, collapsed: false })
  }

  render() {
    const {
      history,
      location: { pathname },
    } = this.props

    // const { path } = this.props.match;
    const { collapsed, sideBarState } = this.state
    const { sessionStore } = this.props
    const layout = (
      <Layout className="h-100 container-style-custom">
        {/* <div className="left-menu-style">
          <Appbar
            history={history}
            sessionStore={sessionStore}
            changeMenu={this.onChangeMenu}
          />
        </div> */}
        <div className="footer-menu-style">
          <FooterAppbar
            sessionStore={sessionStore}
            changeMenu={this.onChangeMenu}
          />
        </div>

        {/* {sideBarState === sidebarStatus.account && (
          <AccountSider
            path={path}
            onCollapse={() =>
              this.setState({ collapsed: !this.state.collapsed })
            }
            history={history}
            collapsed={collapsed}
          />
        )} */}
        {sideBarState === sidebarStatus.setting && <NoSider />}
        <Layout
          className="site-layout"
          style={
            this.state.sideBarState !== 2
              ? {
                  marginLeft: collapsed
                    ? 0
                    : window.innerWidth < 600
                    ? window.innerWidth
                    : 0,
                }
              : { marginLeft: 0 }
          }
        >
          <Header
            changeMenu={this.onChangeMenu}
            sessionStore={sessionStore}
            onCollapse={() =>
              this.setState({
                collapsed:
                  this.state.sideBarState !== 2 ? !this.state.collapsed : true,
              })
            }
            sideBarState={this.state.sideBarState}
            collapsed={
              this.state.sideBarState !== 2 ? this.state.collapsed : true
            }
            history={history}
          />

          <Content className="h-100">
            <Switch>
              {Object.keys(portalLayouts).map((route: any, index: any) => {
                return (
                  <ProtectedRoute
                    key={index}
                    path={portalLayouts[route].path}
                    component={portalLayouts[route].component}
                    permission={portalLayouts[route].permission}
                    routedata={portalLayouts[route].routedata}
                  />
                )
              })}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )

    return (
      <DocumentTitle title={utils.getPageTitle(pathname)}>
        {layout}
      </DocumentTitle>
    )
  }
}

export default AppLayout
