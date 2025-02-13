import * as React from "react"

import Router from "./components/Layout/Router"
import SessionStore from "./stores/sessionStore"
import SignalRAspNetCoreHelper from "./lib/signalRAspNetCoreHelper"
import Stores from "./stores/storeIdentifier"
import { inject } from "mobx-react"
import withSplashScreen from "@components/Layout/SplashScreen"

import AppConsts from "@lib/appconst"

const { authorization } = AppConsts

export interface IAppProps {
  sessionStore?: SessionStore
}

@inject(Stores.SessionStore)
class App extends React.Component<IAppProps> {
  state = { isLoading: true }

  async componentDidMount() {
    // const initialValue = document.body.style as any

    // if (window.devicePixelRatio === 1.25) {
    //   initialValue.zoom = '80%'
    // }

    await this.props.sessionStore!.getCurrentLoginInformations()

    // TODO: Luôn luôn Redirect sang login nếu chưa đăng nhập
    // if (
    //   !this.props.sessionStore!.currentLogin.user &&
    //   window.location.pathname !== "/account/reset-password" &&
    //   window.location.pathname !== "/account/login"
    // ) {
    //   window.location.href = "/account/login";
    // }

    if (
      !!this.props.sessionStore!.currentLogin.user &&
      this.props.sessionStore!.currentLogin.application.features["SignalR"]
    ) {
      SignalRAspNetCoreHelper.initSignalR()
    }

    if (
      !!this.props.sessionStore!.currentLogin.user &&
      localStorage.getItem(authorization.projectId)
    ) {
      await Promise.all([
        this.props.sessionStore?.getMyProfilePicture(),
        this.props.sessionStore!.getOwnProjects({}),
        this.props.sessionStore!.getWebConfiguration(),
      ])
    }

    this.setState({ isLoading: false })
  }

  public render() {
    if (this.state.isLoading) return null

    return <Router />
  }
}

export default withSplashScreen(App)
