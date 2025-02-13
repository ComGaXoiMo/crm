import * as React from "react"

import Router from "./components/Layout/Router"
import SessionStore from "./stores/sessionStore"
import SignalRAspNetCoreHelper from "./lib/signalRAspNetCoreHelper"
import Stores from "./stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import withSplashScreen from "@components/Layout/SplashScreen"

import AppConsts from "@lib/appconst"
import { HelmetProvider } from "react-helmet-async"

const { authorization } = AppConsts

export interface IAppProps {
  sessionStore?: SessionStore
}

@inject(Stores.SessionStore)
@observer
class App extends React.Component<IAppProps> {
  state = { isLoading: true }

  async componentDidMount() {
    try {
      await this.props.sessionStore!.getCurrentLoginInformations()

      if (
        !!this.props.sessionStore!.currentLogin?.user &&
        this.props.sessionStore!.currentLogin?.application?.features?.[
          "SignalR"
        ]
      ) {
        SignalRAspNetCoreHelper.initSignalR()
      }

      if (
        !!this.props.sessionStore!.currentLogin?.user &&
        localStorage.getItem(authorization.projectId)
      ) {
        await Promise.all([
          this.props.sessionStore?.getMyProfilePicture(),
          this.props.sessionStore!.getOwnProjects({}),
          this.props.sessionStore!.getWebConfiguration(),
        ])
      }

      this.setState({ isLoading: false })
    } catch (error) {
      console.error("Error in componentDidMount:", error)
      this.setState({ isLoading: false }) // Đảm bảo UI không bị treo nếu lỗi xảy ra
    }
  }

  public render() {
    if (this.state.isLoading) return null

    return (
      <HelmetProvider>
        <Router />
      </HelmetProvider>
    )
  }
}

export default withSplashScreen(App)
