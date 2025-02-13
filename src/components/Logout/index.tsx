import * as React from 'react'

import AuthenticationStore from '../../stores/authenticationStore'
import Stores from '../../stores/storeIdentifier'
import { inject } from 'mobx-react'
import SessionStore from '@stores/sessionStore'

export interface ILogoutProps {
  authenticationStore?: AuthenticationStore
  sessionStore?: SessionStore
}

@inject(Stores.AuthenticationStore, Stores.SessionStore)
class Logout extends React.Component<ILogoutProps> {
  componentDidMount() {
    this.props.authenticationStore!.logout()
    this.props.sessionStore!.logout()
  }

  render() {
    return null
  }
}

export default Logout
