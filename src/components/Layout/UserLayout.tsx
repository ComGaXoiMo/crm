import "./UserLayout.less"

import React from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import LanguageSelect from "./Header/LanguageSelect"
import { userLayout } from "./Router/router.config"
import utils from "../../utils/utils"
import { Helmet } from "react-helmet-async"
import { Suspense } from "react"
const UserLayout: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <Helmet>
        <title>{utils.getPageTitle(location.pathname)}</title>
      </Helmet>
      <div className="container">
        <div className="lang" style={{ paddingRight: "15px" }}>
          <LanguageSelect wrapClass="auth-language" type="horizontal" />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {Object.keys(userLayout).map((pageName: any, index: number) => {
              const Child = userLayout[pageName].component
              return (
                <Route
                  key={index}
                  path={userLayout[pageName].path.replace("/account", "")}
                  element={<Child />}
                />
              )
            })}

            <Route path="/account" element={<Navigate to="/account/login" />} />
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default UserLayout
