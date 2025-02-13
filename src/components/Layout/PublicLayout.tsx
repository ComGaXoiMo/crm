import "./PublicLayout.less"
import React from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Layout } from "antd"
import { Helmet } from "react-helmet-async"
import { publicLayout } from "./Router/router.config"
import utils from "../../utils/utils"

const { Content } = Layout

const PublicLayout: React.FC = () => {
  const location = useLocation()

  return (
    <>
      {/* Thay DocumentTitle bằng Helmet */}
      <Helmet>
        <title>{utils.getPageTitle(location.pathname)}</title>
      </Helmet>

      <Content className="container">
        <Routes>
          {Object.keys(publicLayout).map((pageName: any, index: number) => (
            <Route
              key={index}
              path={publicLayout[pageName].path}
              element={publicLayout[pageName].component}
            />
          ))}

          {/* Thay Redirect bằng Navigate */}
          <Route
            path="/account"
            element={<Navigate to="/account/login" replace />}
          />
        </Routes>
      </Content>
    </>
  )
}

export default PublicLayout
