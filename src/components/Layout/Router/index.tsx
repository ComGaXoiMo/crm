import React from "react"
import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import { layoutRouter } from "./router.config"
import withRouter from "./withRouter"

const Router = () => {
  const UserLayout = layoutRouter.userLayout
  const AppLayout = layoutRouter.appLayout
  const PublicLayout = layoutRouter.publicLayout

  return (
    <>
      <Routes>
        <Route path="/health" element={<h3>status:200</h3>} />
        <Route path="/account" element={<UserLayout />} />
        <Route path="/public" element={<PublicLayout />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default withRouter(Router)
