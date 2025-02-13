import "./PublicLayout.less"

import * as React from "react"

import { Redirect, Route, Switch } from "react-router-dom"

import { Layout } from "antd"
import DocumentTitle from "react-document-title"
import { publicLayout } from "./Router/router.config"
import utils from "../../utils/utils"
const { Content } = Layout

class PublicLayout extends React.Component<any> {
  render() {
    const {
      location: { pathname },
    } = this.props

    return (
      <DocumentTitle title={utils.getPageTitle(pathname)}>
        <Content className="container">
          <Switch>
            {Object.keys(publicLayout).map((pageName: any, index: number) => (
              <Route
                key={index}
                path={publicLayout[pageName].path}
                component={publicLayout[pageName].component}
                exact={publicLayout[pageName].exact}
              />
            ))}

            <Redirect from="/account" to="/account/login" />
          </Switch>
        </Content>
      </DocumentTitle>
    )
  }
}

export default PublicLayout
