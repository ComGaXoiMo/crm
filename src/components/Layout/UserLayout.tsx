import "./UserLayout.less"

import React from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import LanguageSelect from "./Header/LanguageSelect"
import { userLayout } from "./Router/router.config"
import utils from "../../utils/utils"
import { Helmet } from "react-helmet-async"

const UserLayout: React.FC = () => {
  const location = useLocation()
  console.log("23")
  return (
    <>
      <Helmet>
        <title>{utils.getPageTitle(location.pathname)}</title>
      </Helmet>
      <div className="container">
        <div className="lang" style={{ paddingRight: "15px" }}>
          <LanguageSelect wrapClass="auth-language" type="horizontal" />
        </div>
        <Routes>
          {Object.keys(userLayout).map((pageName: any) => (
            <Route
              key={pageName}
              path={userLayout[pageName].path}
              element={userLayout[pageName].component}
            />
          ))}

          <Route path="/account" element={<Navigate to="/account/login" />} />
        </Routes>
      </div>
    </>
  )
}

export default UserLayout
