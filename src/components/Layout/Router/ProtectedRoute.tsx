import * as React from "react"

import { Redirect, Route } from "react-router-dom"
import { isGranted } from "@lib/abpUtility"
import { userLayout } from "@components/Layout/Router/router.config"

declare let abp: any

const ProtectedRoute = ({
  path,
  component: Component,
  routedata,
  permission,
  render,
  ...rest
}: any) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!abp.session.userId) {
          return (
            <Redirect
              to={{
                pathname: userLayout.accountLogin.path,
                state: { from: props.location },
              }}
            />
          )
        }
        if (permission && !isGranted(permission)) {
          return (
            <Redirect
              to={{
                pathname: "/exception?type=401",
                state: { from: props.location },
              }}
            />
          )
        }
        return Component ? (
          <Component {...props} routedata={routedata} />
        ) : (
          render(props)
        )
      }}
    />
  )
}

export default ProtectedRoute
