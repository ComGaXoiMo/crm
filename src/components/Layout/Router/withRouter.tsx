import { useLocation, useNavigate, useParams } from "react-router-dom"

export default function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation()
    const navigate = useNavigate() // ✅ Replaces useHistory()
    const params = useParams()

    return (
      <Component
        {...props}
        location={location}
        params={params}
        navigate={navigate}
      />
    )
  }

  return ComponentWithRouterProp
}
