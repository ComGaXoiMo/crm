import * as React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { isGranted } from "@lib/abpUtility"
import { userLayout } from "@components/Layout/Router/router.config"

declare let abp: any

interface ProtectedRouteProps {
  children?: React.ReactNode | any
  permission?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permission,
}) => {
  const location = useLocation()
  if (!abp.session.userId) {
    return (
      <Navigate
        to={userLayout.accountLogin.path}
        state={{ from: location }}
        replace
      />
    )
  }

  if (permission && !isGranted(permission)) {
    return (
      <Navigate to="/exception?type=401" state={{ from: location }} replace />
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
