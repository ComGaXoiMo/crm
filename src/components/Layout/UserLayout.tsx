import './UserLayout.less'

import * as React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'

import DocumentTitle from 'react-document-title'
import LanguageSelect from './Header/LanguageSelect'
import { userLayout } from './Router/router.config'
import utils from '../../utils/utils'

class UserLayout extends React.Component<any> {
  render() {
    const {
      location: { pathname }
    } = this.props

    return (
      <DocumentTitle title={utils.getPageTitle(pathname)}>
        <div className="container">
          <div className={'lang'} style={{ paddingRight: '15px' }}>
            <LanguageSelect wrapClass="auth-language" type="horizontal" />
          </div>
          <Switch>
            {Object.keys(userLayout).map((pageName: any, index: number) => (
              <Route
                key={index}
                path={userLayout[pageName].path}
                component={userLayout[pageName].component}
                exact={userLayout[pageName].exact}
              />
            ))}

            <Redirect from="/account" to="/account/login" />
          </Switch>
        </div>
      </DocumentTitle>
    )
  }
}

export default UserLayout
