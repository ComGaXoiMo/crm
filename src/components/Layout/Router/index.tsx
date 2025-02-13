import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { layoutRouter } from './router.config'

const Router = () => {
  const UserLayout = layoutRouter.userLayout
  const AppLayout = layoutRouter.appLayout
  const PublicLayout = layoutRouter.publicLayout

  return (
    <Switch>
        <Route path="/health">
                <h3>status:200</h3>
        </Route>
      <Route path="/account" render={(props: any) => <UserLayout {...props} />} />
      <Route path="/public" render={(props: any) => <PublicLayout {...props} />} />
      <ProtectedRoute path="/" render={(props: any) => <AppLayout {...props} exact />} />
    </Switch>
  )
}

export default Router
